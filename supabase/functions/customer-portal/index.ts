
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper for improved logging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CUSTOMER-PORTAL] ${step}${detailsStr}`);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    logStep('Function started');
    
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('Stripe secret key is not configured');
    }
    
    const requestBody = await req.json();
    const userEmail = requestBody?.email;
    
    if (!userEmail) {
      throw new Error('User email is required');
    }
    
    logStep(`Processing request for email: ${userEmail}`);

    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });
    
    const customers = await stripe.customers.list({ 
      email: userEmail,
      limit: 1 
    });

    let customerId;
    if (customers.data.length === 0) {
      logStep(`No customer found for email ${userEmail}, creating new customer`);
      
      const newCustomer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          source: 'customer_portal_function'
        }
      });
      
      customerId = newCustomer.id;
      logStep(`Created new customer with ID: ${customerId}`);
    } else {
      customerId = customers.data[0].id;
      logStep(`Found existing customer with ID: ${customerId}`);
    }

    try {
      // Create the return URL dynamically based on request origin
      const origin = req.headers.get('origin') || 'https://viafix-web.com';
      const returnUrl = `${origin}/mechanic-dashboard`;
      
      logStep('Creating portal session', { customerId, returnUrl });
      
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl
      });

      logStep(`Created portal session: ${portalSession.url}`);

      return new Response(JSON.stringify({ 
        url: portalSession.url,
        error: null 
      }), {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200,
      });
    } catch (portalError) {
      logStep('Portal creation error', { message: portalError instanceof Error ? portalError.message : String(portalError) });
      
      // Extract the helpful message from the error
      const errorMessage = portalError instanceof Error ? portalError.message : 'Failed to create portal session';
      
      // Check if it's a specific configuration error
      const isConfigError = errorMessage.includes('No configuration provided') || 
                          errorMessage.includes('configuration has not been created') ||
                          errorMessage.includes('portal settings') ||
                          errorMessage.includes('portal configuration');
      
      const friendlyMessage = isConfigError
        ? 'Your Stripe Customer Portal needs to be configured. Please visit https://dashboard.stripe.com/test/settings/billing/portal to set it up.'
        : errorMessage;
      
      return new Response(JSON.stringify({ 
        url: null,
        error: friendlyMessage,
        customerExists: !!customerId,
        needsConfiguration: isConfigError,
        rawError: errorMessage // Include the raw error for debugging
      }), {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200, // Always return 200 to avoid CORS issues
      });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    logStep('Error', { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      url: null,
      error: errorMessage,
      needsConfiguration: false
    }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
      status: 200, // Always return 200 to avoid CORS issues
    });
  }
});

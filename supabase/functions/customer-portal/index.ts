
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('[CUSTOMER-PORTAL] Function started');
    
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('Stripe secret key is not configured');
    }
    
    const requestBody = await req.json();
    const userEmail = requestBody?.email;
    
    if (!userEmail) {
      throw new Error('User email is required');
    }
    
    console.log(`[CUSTOMER-PORTAL] Processing request for email: ${userEmail}`);

    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });
    
    // First check if the portal is configured
    try {
      // We can check this by fetching portal configurations
      const portalConfigs = await stripe.billingPortal.configurations.list({
        limit: 1
      });
      
      if (portalConfigs.data.length === 0) {
        console.log('[CUSTOMER-PORTAL] No portal configurations found');
        return new Response(JSON.stringify({ 
          url: null,
          error: 'Stripe Customer Portal is not configured. You must set up your Customer Portal in the Stripe Dashboard.',
          adminAction: true,
          setupUrl: 'https://dashboard.stripe.com/test/settings/billing/portal'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        });
      }
      
      console.log('[CUSTOMER-PORTAL] Portal configurations found:', portalConfigs.data.length);
    } catch (configError) {
      console.error('[CUSTOMER-PORTAL] Error checking portal configurations:', configError);
      // Continue and let the portal creation attempt fail with a more specific error
    }
    
    const customers = await stripe.customers.list({ 
      email: userEmail,
      limit: 1 
    });

    let customerId;
    if (customers.data.length === 0) {
      console.log(`[CUSTOMER-PORTAL] No customer found for email ${userEmail}, creating new customer`);
      
      const newCustomer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          source: 'customer_portal_function'
        }
      });
      
      customerId = newCustomer.id;
      console.log(`[CUSTOMER-PORTAL] Created new customer with ID: ${customerId}`);
    } else {
      customerId = customers.data[0].id;
      console.log(`[CUSTOMER-PORTAL] Found existing customer with ID: ${customerId}`);
    }

    try {
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${req.headers.get('origin') || 'https://viafix-web.com'}/mechanic-dashboard`,
      });

      console.log(`[CUSTOMER-PORTAL] Created portal session: ${portalSession.url}`);

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
      console.error('[CUSTOMER-PORTAL] Portal creation error:', portalError);
      
      // Enhanced error handling for portal configuration issues
      if (portalError.message && (
          portalError.message.includes('No configuration provided') ||
          portalError.message.includes('configuration has not been created')
        )) {
        return new Response(JSON.stringify({ 
          url: null,
          error: 'The Stripe Customer Portal needs to be set up in your Stripe Dashboard before use.',
          adminAction: true,
          setupUrl: 'https://dashboard.stripe.com/test/settings/billing/portal'
        }), {
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          },
          status: 400,
        });
      }
      
      throw portalError;
    }
  } catch (error) {
    console.error('[CUSTOMER-PORTAL] Error:', error);
    
    return new Response(JSON.stringify({ 
      url: null,
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
      status: 400,
    });
  }
});


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

    // Create the portal session with configuration parameter
    try {
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${req.headers.get('origin') || 'https://viafix-web.com'}/mechanic-dashboard`,
        // Optional configuration to ensure it works even if the default isn't set
        configuration: Deno.env.get('STRIPE_PORTAL_CONFIG_ID') || undefined
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
      
      // Return a success response even with error to avoid the non-2xx error
      return new Response(JSON.stringify({ 
        url: null,
        error: portalError instanceof Error ? portalError.message : 'Failed to create portal session',
        customerExists: !!customerId,
        customerPortalConfigured: false
      }), {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200, // Return 200 instead of error status
      });
    }
  } catch (error) {
    console.error('[CUSTOMER-PORTAL] Error:', error);
    
    // Return a 200 response even with error to avoid the non-2xx error
    return new Response(JSON.stringify({ 
      url: null,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
      status: 200, // Return 200 instead of error status
    });
  }
});

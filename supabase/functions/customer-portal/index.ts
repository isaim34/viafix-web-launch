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
    
    try {
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: 'https://billing.stripe.com/p/login/test_9AQaFn1V82Ur8lW3cc',
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
      
      if (portalError.message && portalError.message.includes('No configuration provided')) {
        console.log('[CUSTOMER-PORTAL] Falling back to checkout session due to missing portal configuration');
        
        const checkoutSession = await stripe.checkout.sessions.create({
          customer: customerId,
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: 'Basic Subscription',
                  description: 'Monthly subscription to access premium features',
                },
                unit_amount: 999, // $9.99
                recurring: {
                  interval: 'month',
                },
              },
              quantity: 1,
            },
          ],
          mode: 'subscription',
          success_url: `${req.headers.get('origin')}/mechanic-dashboard?checkout_success=true`,
          cancel_url: `${req.headers.get('origin')}/mechanic-dashboard?checkout_canceled=true`,
        });
        
        console.log(`[CUSTOMER-PORTAL] Created checkout session as fallback: ${checkoutSession.url}`);
        
        return new Response(JSON.stringify({ 
          url: checkoutSession.url,
          error: null 
        }), {
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          },
          status: 200,
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

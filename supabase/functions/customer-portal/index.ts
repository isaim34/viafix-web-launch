
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const logError = (step: string, error: any) => {
  console.error(`[CUSTOMER-PORTAL ERROR] ${step}:`, error);
  return error instanceof Error ? error : new Error(String(error));
}

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('[CUSTOMER-PORTAL] Function started');
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    // Validate authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }
    
    const token = authHeader.replace('Bearer ', '');
    console.log('[CUSTOMER-PORTAL] Authenticating user');
    
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      throw logError('Authentication failed', userError || 'No user found');
    }
    
    console.log('[CUSTOMER-PORTAL] User authenticated:', user.email);

    // Find or create Stripe customer
    console.log('[CUSTOMER-PORTAL] Looking up Stripe customer');
    
    let customers;
    try {
      customers = await stripe.customers.search({
        query: `email:'${user.email}'`,
      });
    } catch (error) {
      throw logError('Stripe customer search failed', error);
    }

    if (customers.length === 0) {
      console.log('[CUSTOMER-PORTAL] No Stripe customer found, creating one');
      try {
        // Create a customer if none exists
        const newCustomer = await stripe.customers.create({
          email: user.email,
          metadata: {
            supabaseUserId: user.id
          }
        });
        
        console.log('[CUSTOMER-PORTAL] Created new customer:', newCustomer.id);
        
        // Create a Billing Portal session for the new customer
        const session = await stripe.billingPortal.sessions.create({
          customer: newCustomer.id,
          return_url: `${req.headers.get('origin')}/mechanic-dashboard`,
        });
        
        return new Response(JSON.stringify({ url: session.url }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (error) {
        throw logError('Customer creation failed', error);
      }
    }

    const customerId = customers.data[0].id;
    console.log('[CUSTOMER-PORTAL] Found customer:', customerId);

    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${req.headers.get('origin')}/mechanic-dashboard`,
      });
      
      console.log('[CUSTOMER-PORTAL] Created portal session:', session.id);
      
      return new Response(JSON.stringify({ url: session.url }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      throw logError('Failed to create portal session', error);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: "There was a problem accessing the subscription management portal. Please try again later or contact support."
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
})

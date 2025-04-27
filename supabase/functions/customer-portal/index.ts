
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
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('[CUSTOMER-PORTAL] Function started');
    
    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw logError('Environment configuration', 'Missing Supabase configuration');
    }
    
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
    
    // Try to get user email - either from token or request body
    let userEmail: string | null = null;
    
    // Extract JWT from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      console.log('[CUSTOMER-PORTAL] Authenticating user with token');
      
      try {
        const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
        
        if (userError) {
          console.error('[CUSTOMER-PORTAL] Token validation error:', userError);
        } else if (userData?.user?.email) {
          userEmail = userData.user.email;
          console.log('[CUSTOMER-PORTAL] User authenticated from token:', userEmail);
        }
      } catch (tokenError) {
        console.error('[CUSTOMER-PORTAL] Token processing error:', tokenError);
      }
    }
    
    // If no email from token, try body
    if (!userEmail) {
      try {
        const requestData = await req.json();
        if (requestData?.email) {
          userEmail = requestData.email;
          console.log('[CUSTOMER-PORTAL] Using email from request body:', userEmail);
        }
      } catch (bodyParseError) {
        console.log('[CUSTOMER-PORTAL] No body data provided or parse error');
      }
    }

    if (!userEmail) {
      throw logError('User validation', 'No email found for user');
    }
    
    // Find or create Stripe customer
    console.log('[CUSTOMER-PORTAL] Looking up Stripe customer for email:', userEmail);
    
    let customers;
    try {
      customers = await stripe.customers.search({
        query: `email:'${userEmail}'`,
      });
    } catch (error) {
      throw logError('Stripe customer search failed', error);
    }

    let customerId;
    
    if (customers.data.length === 0) {
      console.log('[CUSTOMER-PORTAL] No Stripe customer found, creating one');
      try {
        // Create a customer if none exists
        const newCustomer = await stripe.customers.create({
          email: userEmail,
        });
        
        customerId = newCustomer.id;
        console.log('[CUSTOMER-PORTAL] Created new customer:', customerId);
      } catch (error) {
        throw logError('Customer creation failed', error);
      }
    } else {
      customerId = customers.data[0].id;
      console.log('[CUSTOMER-PORTAL] Found existing customer:', customerId);
    }

    try {
      const origin = req.headers.get('origin') || 'http://localhost:3000';
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${origin}/mechanic-dashboard`,
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
});


import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('[CUSTOMER-PORTAL] Function started');
    
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('Stripe secret key is not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration is incomplete');
    }
    
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
    
    // Extract email from the request body
    const requestBody = await req.json();
    const userEmail = requestBody?.email;
    
    if (!userEmail) {
      throw new Error('User email is required');
    }

    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });
    
    // Search for Stripe customer by email
    const customers = await stripe.customers.list({ 
      email: userEmail,
      limit: 1 
    });

    if (customers.data.length === 0) {
      throw new Error('No Stripe customer found for this email');
    }

    const customerId = customers.data[0].id;
    
    // Create Stripe Billing Portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: 'https://npwxxmboagkouafjwhhw.supabase.co/mechanic-dashboard',
    });

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


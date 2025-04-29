
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
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
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseServiceRole) {
      throw new Error('Supabase environment variables are not configured');
    }
    
    const supabaseClient = createClient(supabaseUrl, supabaseServiceRole);
    
    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !data.user) {
      logStep('Authentication failed', { error: userError });
      throw new Error('Not authenticated');
    }

    const user = data.user;
    logStep('User authenticated', { userId: user.id, email: user.email });
    
    const requestBody = await req.json();
    const userEmail = requestBody?.email || user.email;
    
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
          source: 'customer_portal_function',
          supabase_user_id: user.id
        }
      });
      
      customerId = newCustomer.id;
      logStep(`Created new customer with ID: ${customerId}`);
    } else {
      customerId = customers.data[0].id;
      logStep(`Found existing customer with ID: ${customerId}`);
    }

    // Create the return URL dynamically based on request origin
    const origin = req.headers.get('origin') || req.headers.get('referer') || 'https://viafix-web.com';
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

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep('Error', { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      url: null,
      error: errorMessage
    }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
      status: 200, // Always return 200 to avoid CORS issues
    });
  }
});

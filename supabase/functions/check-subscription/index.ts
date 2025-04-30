
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseServiceRole) {
      throw new Error('Supabase environment variables are not configured');
    }
    
    // Use the service role key to perform writes in Supabase
    const supabaseClient = createClient(supabaseUrl, supabaseServiceRole);

    // First check for auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      logStep("No authorization header provided - checking body for email");
      // If no auth header, try to get email from request body (fallback)
      try {
        const body = await req.json();
        if (body && body.email) {
          logStep("Using email from request body", { email: body.email });
          
          // In this case, we'll check for subscriptions by email only
          const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
          const customers = await stripe.customers.list({ email: body.email, limit: 1 });
          
          if (customers.data.length === 0) {
            logStep("No customer found for email", { email: body.email });
            return new Response(JSON.stringify({ 
              subscribed: false,
              subscription_tier: null,
              subscription_end: null
            }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 200,
            });
          }
          
          // Continue with subscription check using the found customer
          const customerId = customers.data[0].id;
          logStep("Found customer", { customerId });
          
          // Get all subscriptions for the customer
          const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: "active",
            expand: ['data.plan'],
            limit: 5, // Get up to 5 active subscriptions (most users will have only 1)
          });
          
          // Get all payments for the customer (for one-time purchases)
          const payments = await stripe.paymentIntents.list({
            customer: customerId,
            limit: 10,
          });
          
          const hasActiveSub = subscriptions.data.length > 0;
          let subscriptionTier = null;
          let subscriptionEnd = null;
          let subscriptionId = null;
          
          if (hasActiveSub) {
            const subscription = subscriptions.data[0]; // Use the most recent subscription
            subscriptionId = subscription.id;
            subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
            subscriptionTier = subscription.metadata?.plan_type || 'monthly';
            logStep("Active subscription found", { 
              subscriptionId, 
              endDate: subscriptionEnd,
              tier: subscriptionTier
            });
          } else {
            logStep("No active subscription found");
          }
          
          logStep("Returning subscription info without updating database (no user_id available)", { subscribed: hasActiveSub });
          
          return new Response(JSON.stringify({
            subscribed: hasActiveSub,
            subscription_tier: subscriptionTier,
            subscription_end: subscriptionEnd
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          });
        }
      } catch (e) {
        logStep("Error parsing request body", { error: e });
        // Continue to auth error below
      }
      
      throw new Error("No authorization header provided");
    }

    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found, updating unsubscribed state");
      
      // Store subscription status in Supabase subscribers table
      try {
        const { error: insertError } = await supabaseClient.from("subscribers").upsert({
          user_id: user.id,
          email: user.email,
          stripe_customer_id: null,
          subscribed: false,
          subscription_tier: null,
          subscription_end: null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });
        
        if (insertError) {
          logStep("Error updating subscription status", { error: insertError });
        }
      } catch (dbError) {
        logStep("Database error when updating subscriber record", { error: dbError });
        // Continue despite DB error - we should still return the subscription status
      }
      
      return new Response(JSON.stringify({ 
        subscribed: false,
        subscription_tier: null,
        subscription_end: null
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 5, // Check for multiple subscriptions just in case
    });
    
    const hasActiveSub = subscriptions.data.length > 0;
    let subscriptionTier = null;
    let subscriptionEnd = null;
    let subscriptionId = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionId = subscription.id;
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      logStep("Active subscription found", { subscriptionId, endDate: subscriptionEnd });
      
      // Determine subscription tier from plan type in metadata
      subscriptionTier = subscription.metadata?.plan_type || 'monthly';
      
      logStep("Determined subscription tier", { subscriptionTier });
    } else {
      logStep("No active subscription found");
    }

    // Store subscription status in Supabase subscribers table
    try {
      const { error: upsertError } = await supabaseClient.from("subscribers").upsert({
        user_id: user.id,
        email: user.email,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        subscribed: hasActiveSub,
        subscription_tier: subscriptionTier,
        subscription_end: subscriptionEnd,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

      if (upsertError) {
        logStep("Error updating subscription status", { error: upsertError });
      }
    } catch (dbError) {
      logStep("Database error when updating subscriber record", { error: dbError });
      // Continue despite DB error - we should still return the subscription status
    }

    // Also store subscription info in localStorage for frontend access
    logStep("Updated database with subscription info", { subscribed: hasActiveSub, subscriptionTier });
    
    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      subscribed: false,
      subscription_tier: null,
      subscription_end: null 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200, // Return 200 even with errors to prevent CORS issues
    });
  }
});

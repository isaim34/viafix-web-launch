
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

// Improved customer ID resolution function
const resolveCustomerId = async (stripe: Stripe, email: string) => {
  logStep("Starting customer ID resolution", { email });
  
  // Fetch ALL customers for this email (no limit)
  const customers = await stripe.customers.list({ 
    email: email,
    expand: ['data.subscriptions'],
  });
  
  logStep("Found customers", { 
    count: customers.data.length,
    customerIds: customers.data.map(c => ({ id: c.id, created: c.created }))
  });
  
  if (customers.data.length === 0) {
    logStep("No customers found for email");
    return null;
  }
  
  if (customers.data.length === 1) {
    logStep("Single customer found", { customerId: customers.data[0].id });
    return customers.data[0].id;
  }
  
  // Multiple customers exist - prioritize the MOST RECENTLY CREATED
  logStep("Multiple customers found, prioritizing most recent");
  
  // Sort by creation date (most recent first)
  const sortedByCreation = customers.data.sort((a, b) => b.created - a.created);
  const mostRecentCustomer = sortedByCreation[0];
  
  logStep("Selected most recently created customer", { 
    customerId: mostRecentCustomer.id,
    created: new Date(mostRecentCustomer.created * 1000).toISOString(),
    reason: "most_recent_creation",
    allCustomers: sortedByCreation.map(c => ({
      id: c.id,
      created: new Date(c.created * 1000).toISOString()
    }))
  });
  
  return mostRecentCustomer.id;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      logStep("STRIPE_SECRET_KEY is not set - returning unsubscribed");
      return new Response(JSON.stringify({
        subscribed: false,
        subscription_tier: null,
        subscription_end: null
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseServiceRole) {
      throw new Error('Supabase environment variables are not configured');
    }
    
    // Use the service role key to perform writes in Supabase
    const supabaseClient = createClient(supabaseUrl, supabaseServiceRole);
    logStep("Supabase client initialized");

    // Check for auth header - but don't require it
    const authHeader = req.headers.get("Authorization");
    logStep("Authorization header check", { hasAuthHeader: !!authHeader });
    
    if (!authHeader) {
      logStep("No authorization header - checking body for email");
      // If no auth header, try to get email from request body (local auth)
      try {
        const body = await req.json();
        if (body && body.email) {
          logStep("Using email from request body", { email: body.email });
          
          // Always check Stripe for all accounts when we have a Stripe key
          const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
          
          try {
            logStep("Starting customer resolution for body email", { email: body.email });
            const customerId = await resolveCustomerId(stripe, body.email);
            
            if (!customerId) {
              logStep("No Stripe customer found for email", { email: body.email });
              return new Response(JSON.stringify({ 
                subscribed: false,
                subscription_tier: null,
                subscription_end: null
              }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
              });
            }
            
            logStep("Resolved customer ID", { customerId });
            
            // Get all subscriptions for the resolved customer
            const subscriptions = await stripe.subscriptions.list({
              customer: customerId,
              status: "active",
              expand: ['data.plan'],
              limit: 5,
            });
            
            const hasActiveSub = subscriptions.data.length > 0;
            let subscriptionTier = null;
            let subscriptionEnd = null;
            
            if (hasActiveSub) {
              const subscription = subscriptions.data[0];
              subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
              subscriptionTier = subscription.metadata?.plan_type || 'monthly';
              logStep("Active subscription found via body email", { 
                subscriptionId: subscription.id, 
                endDate: subscriptionEnd,
                tier: subscriptionTier,
                status: subscription.status 
              });
            } else {
              logStep("No active subscription found via body email");
            }
            
            return new Response(JSON.stringify({
              subscribed: hasActiveSub,
              subscription_tier: subscriptionTier,
              subscription_end: subscriptionEnd
            }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 200,
            });
          } catch (stripeError) {
            logStep("Stripe API error - falling back to unsubscribed", { error: stripeError.message });
            return new Response(JSON.stringify({
              subscribed: false,
              subscription_tier: null,
              subscription_end: null
            }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 200,
            });
          }
        }
      } catch (e) {
        logStep("Error parsing request body", { error: e });
      }
      
      logStep("No email found in body, returning auth error");
      return new Response(JSON.stringify({ 
        error: "No authorization header or email provided",
        subscribed: false,
        subscription_tier: null,
        subscription_end: null 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    logStep("Authorization header found, processing with Supabase auth");

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) {
      logStep("Authentication error", { error: userError.message });
      return new Response(JSON.stringify({ 
        error: `Authentication error: ${userError.message}`,
        subscribed: false,
        subscription_tier: null,
        subscription_end: null 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
    
    const user = userData.user;
    if (!user?.email) {
      logStep("User not authenticated or email not available");
      return new Response(JSON.stringify({ 
        error: "User not authenticated or email not available",
        subscribed: false,
        subscription_tier: null,
        subscription_end: null 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
    
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    logStep("Starting customer resolution for authenticated user", { email: user.email });
    
    try {
      // Check if user already exists in subscribers table to see stored customer ID
      const { data: existingSubscriber } = await supabaseClient
        .from("subscribers")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
        
      if (existingSubscriber) {
        logStep("Found existing subscriber record", { 
          storedCustomerId: existingSubscriber.stripe_customer_id,
          subscribed: existingSubscriber.subscribed
        });
      }
      
      const customerId = await resolveCustomerId(stripe, user.email);
      
      if (!customerId) {
        logStep("No Stripe customer found, updating unsubscribed state");
        
        // Store subscription status in Supabase subscribers table
        try {
          if (existingSubscriber) {
            logStep("Updating existing subscriber record", { userId: user.id });
            
            const { error: updateError } = await supabaseClient
              .from("subscribers")
              .update({
                subscribed: false,
                subscription_tier: null,
                subscription_end: null,
                updated_at: new Date().toISOString(),
              })
              .eq("user_id", user.id);
              
            if (updateError) {
              logStep("Error updating subscription status", { error: updateError });
            }
          } else {
            logStep("Creating new subscriber record", { userId: user.id });
            
            const { error: insertError } = await supabaseClient
              .from("subscribers")
              .insert({
                user_id: user.id,
                email: user.email,
                stripe_customer_id: null,
                subscribed: false,
                subscription_tier: null,
                subscription_end: null,
              });
              
            if (insertError) {
              logStep("Error inserting subscription status", { error: insertError });
            }
          }
        } catch (dbError) {
          logStep("Database error when updating subscriber record", { error: dbError });
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

      logStep("Resolved customer ID for authenticated user", { customerId });
      
      // Log customer ID changes
      if (existingSubscriber && existingSubscriber.stripe_customer_id && 
          existingSubscriber.stripe_customer_id !== customerId) {
        logStep("Customer ID mismatch detected - updating", {
          oldCustomerId: existingSubscriber.stripe_customer_id,
          newCustomerId: customerId,
          reason: "resolved_to_different_customer"
        });
      }

      // Make sure to check for all subscription statuses that are "active"
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: "all",
        expand: ['data.plan'],
        limit: 10,
      });
      
      // Log all subscriptions for debugging
      subscriptions.data.forEach((sub, idx) => {
        logStep(`Subscription ${idx+1} found`, { 
          id: sub.id, 
          status: sub.status, 
          current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
          metadata: sub.metadata
        });
      });
      
      // Filter for active subscriptions
      const activeSubscriptions = subscriptions.data.filter(
        sub => ['active', 'trialing', 'past_due'].includes(sub.status)
      );
      
      const hasActiveSub = activeSubscriptions.length > 0;
      let subscriptionTier = null;
      let subscriptionEnd = null;
      let subscriptionId = null;

      if (hasActiveSub) {
        const subscription = activeSubscriptions.sort(
          (a, b) => b.current_period_end - a.current_period_end
        )[0];
        
        subscriptionId = subscription.id;
        subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
        subscriptionTier = subscription.metadata?.plan_type || 'monthly';
        
        logStep("Active subscription found for authenticated user", { 
          subscriptionId, 
          endDate: subscriptionEnd,
          status: subscription.status,
          metadata: subscription.metadata,
          resolvedCustomerId: customerId
        });
      } else {
        logStep("No active subscription found for authenticated user", {
          resolvedCustomerId: customerId
        });
      }

      // Store subscription status in Supabase subscribers table with resolved customer ID
      try {
        if (existingSubscriber) {
          logStep("Updating existing subscriber record for authenticated user", { 
            userId: user.id,
            id: existingSubscriber.id,
            updatingCustomerId: customerId
          });
          
          const { error: updateError } = await supabaseClient
            .from("subscribers")
            .update({
              stripe_customer_id: customerId, // Use resolved customer ID
              stripe_subscription_id: subscriptionId,
              subscribed: hasActiveSub,
              subscription_tier: subscriptionTier,
              subscription_end: subscriptionEnd,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingSubscriber.id);
          
          if (updateError) {
            logStep("Error updating subscription status", { error: updateError });
          } else {
            logStep("Successfully updated subscriber record with resolved customer ID");
          }
        } else {
          logStep("Creating new subscriber record for authenticated user", { 
            userId: user.id,
            customerId: customerId
          });
          
          const { error: insertError } = await supabaseClient
            .from("subscribers")
            .insert({
              user_id: user.id,
              email: user.email,
              stripe_customer_id: customerId, // Use resolved customer ID
              stripe_subscription_id: subscriptionId,
              subscribed: hasActiveSub,
              subscription_tier: subscriptionTier,
              subscription_end: subscriptionEnd,
            });
          
          if (insertError) {
            logStep("Error inserting subscriber record", { error: insertError });
          } else {
            logStep("Successfully inserted subscriber record with resolved customer ID");
          }
        }
      } catch (dbError) {
        logStep("Database error when updating subscriber record", { error: dbError });
        // Continue despite DB error - we should still return the subscription status
      }

      logStep("Returning subscription info for authenticated user", { 
        subscribed: hasActiveSub, 
        subscriptionTier,
        subscriptionEnd,
        resolvedCustomerId: customerId
      });
      
      return new Response(JSON.stringify({
        subscribed: hasActiveSub,
        subscription_tier: subscriptionTier,
        subscription_end: subscriptionEnd
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } catch (stripeError) {
      logStep("Stripe API error - falling back to unsubscribed", { error: stripeError.message });
      return new Response(JSON.stringify({
        subscribed: false,
        subscription_tier: null,
        subscription_end: null
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
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
      status: 200,
    });
  }
});

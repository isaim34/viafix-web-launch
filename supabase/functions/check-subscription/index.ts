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

// Helper function to detect test accounts
const isTestAccount = (email: string): boolean => {
  const testPatterns = [
    /test\./i,
    /demo\./i,
    /@example\.com$/i,
    /@test\.com$/i,
    /testmechanic/i,
    /testcustomer/i,
    /test_/i,
    /demo_/i
  ];
  
  return testPatterns.some(pattern => pattern.test(email));
};

// Helper function to return mock subscription data for test accounts
const getMockSubscriptionData = (email: string) => {
  logStep("Returning mock subscription data for test account", { email });
  
  // Return different mock data based on email pattern
  if (email.includes('premium') || email.includes('subscribed')) {
    return {
      subscribed: true,
      subscription_tier: 'monthly',
      subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
    };
  } else if (email.includes('annual')) {
    return {
      subscribed: true,
      subscription_tier: 'annual',
      subscription_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year from now
    };
  } else {
    return {
      subscribed: false,
      subscription_tier: null,
      subscription_end: null
    };
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      logStep("STRIPE_SECRET_KEY is not set - continuing with fallback mode");
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

    // First check for auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      logStep("No authorization header provided - checking body for email");
      // If no auth header, try to get email from request body (fallback)
      try {
        const body = await req.json();
        if (body && body.email) {
          logStep("Using email from request body", { email: body.email });
          
          // Check if this is a test account
          if (isTestAccount(body.email)) {
            const mockData = getMockSubscriptionData(body.email);
            logStep("Returning mock data for test account without Stripe call");
            return new Response(JSON.stringify(mockData), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 200,
            });
          }

          // If not a test account and we have a Stripe key, proceed with Stripe check
          if (stripeKey) {
            const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
            
            try {
              const customers = await stripe.customers.list({ 
                email: body.email, 
                limit: 1,
                expand: ['data.subscriptions'],
              });
              
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
                limit: 5,
              });
              
              const hasActiveSub = subscriptions.data.length > 0;
              let subscriptionTier = null;
              let subscriptionEnd = null;
              
              if (hasActiveSub) {
                const subscription = subscriptions.data[0];
                subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
                subscriptionTier = subscription.metadata?.plan_type || 'monthly';
                logStep("Active subscription found", { 
                  subscriptionId: subscription.id, 
                  endDate: subscriptionEnd,
                  tier: subscriptionTier,
                  status: subscription.status 
                });
              } else {
                logStep("No active subscription found");
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
          } else {
            logStep("No Stripe key available - returning unsubscribed for real account");
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

    // Check if this is a test account
    if (isTestAccount(user.email)) {
      const mockData = getMockSubscriptionData(user.email);
      
      // Still update the database for test accounts
      try {
        const { data: existingSubscriber } = await supabaseClient
          .from("subscribers")
          .select("*")
          .eq("user_id", user.id)
          .single();
          
        if (existingSubscriber) {
          logStep("Updating existing test subscriber record", { userId: user.id });
          
          const { error: updateError } = await supabaseClient
            .from("subscribers")
            .update({
              subscribed: mockData.subscribed,
              subscription_tier: mockData.subscription_tier,
              subscription_end: mockData.subscription_end,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", user.id);
            
          if (updateError) {
            logStep("Error updating test subscription status", { error: updateError });
          }
        } else {
          logStep("Creating new test subscriber record", { userId: user.id });
          
          const { error: insertError } = await supabaseClient
            .from("subscribers")
            .insert({
              user_id: user.id,
              email: user.email,
              stripe_customer_id: null,
              subscribed: mockData.subscribed,
              subscription_tier: mockData.subscription_tier,
              subscription_end: mockData.subscription_end,
            });
            
          if (insertError) {
            logStep("Error inserting test subscription status", { error: insertError });
          }
        }
      } catch (dbError) {
        logStep("Database error when updating test subscriber record", { error: dbError });
      }
      
      logStep("Returning mock subscription data for authenticated test account");
      return new Response(JSON.stringify(mockData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // If no Stripe key is available, return unsubscribed for real accounts
    if (!stripeKey) {
      logStep("No Stripe key available - returning unsubscribed for real account");
      return new Response(JSON.stringify({
        subscribed: false,
        subscription_tier: null,
        subscription_end: null
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Add cache-busting query param to prevent cached results
    const timestamp = new Date().getTime();
    
    logStep("Finding Stripe customer for user", { email: user.email });
    
    try {
      const customers = await stripe.customers.list({ 
        email: user.email, 
        limit: 1,
        expand: ['data.subscriptions'],
      });
      
      if (customers.data.length === 0) {
        logStep("No customer found, updating unsubscribed state");
        
        // Check if user already exists in subscribers table
        const { data: existingSubscriber } = await supabaseClient
          .from("subscribers")
          .select("*")
          .eq("user_id", user.id)
          .single();
          
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

      const customerId = customers.data[0].id;
      logStep("Found Stripe customer", { customerId });

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
        
        logStep("Active subscription found", { 
          subscriptionId, 
          endDate: subscriptionEnd,
          status: subscription.status,
          metadata: subscription.metadata
        });
      } else {
        logStep("No active subscription found");
      }

      // Check if user already exists in subscribers table
      const { data: existingSubscriber } = await supabaseClient
        .from("subscribers")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      // Store subscription status in Supabase subscribers table
      try {
        if (existingSubscriber) {
          logStep("Updating existing subscriber record", { 
            userId: user.id,
            id: existingSubscriber.id 
          });
          
          const { error: updateError } = await supabaseClient
            .from("subscribers")
            .update({
              stripe_customer_id: customerId,
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
            logStep("Successfully updated subscriber record");
          }
        } else {
          logStep("Creating new subscriber record", { userId: user.id });
          
          const { error: insertError } = await supabaseClient
            .from("subscribers")
            .insert({
              user_id: user.id,
              email: user.email,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              subscribed: hasActiveSub,
              subscription_tier: subscriptionTier,
              subscription_end: subscriptionEnd,
            });
          
          if (insertError) {
            logStep("Error inserting subscriber record", { error: insertError });
          } else {
            logStep("Successfully inserted subscriber record");
          }
        }
      } catch (dbError) {
        logStep("Database error when updating subscriber record", { error: dbError });
        // Continue despite DB error - we should still return the subscription status
      }

      logStep("Returning subscription info", { 
        subscribed: hasActiveSub, 
        subscriptionTier,
        subscriptionEnd 
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

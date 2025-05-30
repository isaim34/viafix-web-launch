
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

// Enhanced logging function for debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION-V3] ${step}${detailsStr}`);
};

// STRICT customer ID resolution - ALWAYS returns the NEWEST customer
const resolveCustomerId = async (stripe: Stripe, email: string) => {
  logStep("🔍 STARTING STRICT CUSTOMER RESOLUTION", { email });
  
  try {
    // Fetch ALL customers for this email (no limits)
    const customers = await stripe.customers.list({ 
      email: email,
      expand: ['data.subscriptions'],
      limit: 100 // Ensure we get all customers
    });
    
    logStep("📊 FOUND CUSTOMERS", { 
      count: customers.data.length,
      customerDetails: customers.data.map(c => ({ 
        id: c.id, 
        created: c.created,
        createdReadable: new Date(c.created * 1000).toISOString(),
        hasSubscriptions: c.subscriptions?.data?.length || 0
      }))
    });
    
    if (customers.data.length === 0) {
      logStep("❌ NO CUSTOMERS FOUND");
      return null;
    }
    
    if (customers.data.length === 1) {
      logStep("✅ SINGLE CUSTOMER - AUTO SELECT", { 
        customerId: customers.data[0].id,
        created: new Date(customers.data[0].created * 1000).toISOString()
      });
      return customers.data[0].id;
    }
    
    // MULTIPLE CUSTOMERS - FORCE SELECT THE NEWEST ONE
    logStep("🔄 MULTIPLE CUSTOMERS - FORCING NEWEST SELECTION");
    
    // Sort by creation timestamp (newest first)
    const sortedCustomers = customers.data.sort((a, b) => b.created - a.created);
    const newestCustomer = sortedCustomers[0];
    
    logStep("🎯 STRICT NEWEST CUSTOMER SELECTED", { 
      selectedCustomerId: newestCustomer.id,
      selectedCreated: new Date(newestCustomer.created * 1000).toISOString(),
      selectedTimestamp: newestCustomer.created,
      reason: "STRICT_NEWEST_POLICY",
      allCustomersRanked: sortedCustomers.map((c, index) => ({
        rank: index + 1,
        id: c.id,
        created: new Date(c.created * 1000).toISOString(),
        timestamp: c.created,
        selected: index === 0
      }))
    });
    
    return newestCustomer.id;
  } catch (error) {
    logStep("💥 ERROR IN CUSTOMER RESOLUTION", { error: error.message });
    throw error;
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("🚀 FUNCTION STARTED - V3 ENHANCED WITH CREATION DATE SORTING");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      logStep("⚠️ STRIPE_SECRET_KEY MISSING - RETURNING UNSUBSCRIBED");
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
    
    const supabaseClient = createClient(supabaseUrl, supabaseServiceRole);
    logStep("✅ SUPABASE CLIENT INITIALIZED");

    // Check for auth header
    const authHeader = req.headers.get("Authorization");
    logStep("🔐 AUTH CHECK", { hasAuthHeader: !!authHeader });
    
    if (!authHeader) {
      logStep("❌ NO AUTH HEADER - CHECKING BODY");
      try {
        const body = await req.json();
        if (body && body.email) {
          logStep("📧 USING EMAIL FROM BODY", { email: body.email });
          
          const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
          
          try {
            logStep("🔍 STARTING BODY EMAIL CUSTOMER RESOLUTION", { email: body.email });
            const customerId = await resolveCustomerId(stripe, body.email);
            
            if (!customerId) {
              logStep("❌ NO CUSTOMER FOR BODY EMAIL", { email: body.email });
              return new Response(JSON.stringify({ 
                subscribed: false,
                subscription_tier: null,
                subscription_end: null
              }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
              });
            }
            
            logStep("✅ RESOLVED CUSTOMER FOR BODY EMAIL", { customerId });
            
            // Get subscriptions for this specific customer ONLY
            logStep("📋 FETCHING SUBSCRIPTIONS FOR RESOLVED CUSTOMER", { customerId });
            const subscriptions = await stripe.subscriptions.list({
              customer: customerId,
              status: "active",
              expand: ['data.plan'],
              limit: 10,
            });
            
            logStep("📊 SUBSCRIPTION RESULTS", {
              customerIdUsed: customerId,
              subscriptionCount: subscriptions.data.length,
              subscriptions: subscriptions.data.map(sub => ({
                id: sub.id,
                status: sub.status,
                created: sub.created,
                createdReadable: new Date(sub.created * 1000).toISOString(),
                endDate: new Date(sub.current_period_end * 1000).toISOString(),
                planType: sub.metadata?.plan_type,
                customer: sub.customer
              }))
            });
            
            const hasActiveSub = subscriptions.data.length > 0;
            let subscriptionTier = null;
            let subscriptionEnd = null;
            
            if (hasActiveSub) {
              // FIXED: Sort by creation date (most recent first) instead of end date
              const subscription = subscriptions.data.sort((a, b) => b.created - a.created)[0];
              subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
              subscriptionTier = subscription.metadata?.plan_type || 'monthly';
              
              logStep("🎉 MOST RECENT SUBSCRIPTION SELECTED VIA BODY EMAIL", { 
                subscriptionId: subscription.id,
                created: new Date(subscription.created * 1000).toISOString(),
                endDate: subscriptionEnd,
                tier: subscriptionTier,
                status: subscription.status,
                customerUsed: customerId,
                sortedBy: "CREATION_DATE_DESCENDING",
                allSubscriptions: subscriptions.data.map(s => ({
                  id: s.id,
                  created: new Date(s.created * 1000).toISOString(),
                  tier: s.metadata?.plan_type
                }))
              });
            } else {
              logStep("❌ NO ACTIVE SUBSCRIPTION FOR RESOLVED CUSTOMER", { customerId });
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
            logStep("💥 STRIPE ERROR - FALLBACK", { error: stripeError.message });
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
        logStep("💥 ERROR PARSING BODY", { error: e });
      }
      
      logStep("❌ NO EMAIL IN BODY");
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

    logStep("🔐 PROCESSING WITH SUPABASE AUTH");

    const token = authHeader.replace("Bearer ", "");
    logStep("🔑 AUTHENTICATING USER");
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) {
      logStep("💥 AUTH ERROR", { error: userError.message });
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
      logStep("❌ USER NOT AUTHENTICATED");
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
    
    logStep("✅ USER AUTHENTICATED", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    logStep("🔍 STARTING AUTH USER CUSTOMER RESOLUTION", { email: user.email });
    
    try {
      // Check existing subscriber record
      const { data: existingSubscriber } = await supabaseClient
        .from("subscribers")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
        
      if (existingSubscriber) {
        logStep("📋 EXISTING SUBSCRIBER RECORD", { 
          storedCustomerId: existingSubscriber.stripe_customer_id,
          subscribed: existingSubscriber.subscribed
        });
      }
      
      // FORCE RESOLUTION TO NEWEST CUSTOMER - IGNORE STORED VALUE
      logStep("🔄 FORCING FRESH CUSTOMER RESOLUTION - IGNORING STORED DATA");
      const customerId = await resolveCustomerId(stripe, user.email);
      
      if (!customerId) {
        logStep("❌ NO CUSTOMER FOUND - UPDATING UNSUBSCRIBED");
        
        try {
          if (existingSubscriber) {
            logStep("📝 UPDATING EXISTING RECORD TO UNSUBSCRIBED", { userId: user.id });
            
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
              logStep("💥 UPDATE ERROR", { error: updateError });
            }
          } else {
            logStep("📝 CREATING NEW UNSUBSCRIBED RECORD", { userId: user.id });
            
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
              logStep("💥 INSERT ERROR", { error: insertError });
            }
          }
        } catch (dbError) {
          logStep("💥 DATABASE ERROR", { error: dbError });
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

      logStep("✅ RESOLVED CUSTOMER FOR AUTH USER", { customerId });
      
      // Log customer changes
      if (existingSubscriber && existingSubscriber.stripe_customer_id && 
          existingSubscriber.stripe_customer_id !== customerId) {
        logStep("🔄 CUSTOMER ID CHANGE DETECTED", {
          oldCustomerId: existingSubscriber.stripe_customer_id,
          newCustomerId: customerId,
          reason: "FORCED_NEWEST_CUSTOMER_POLICY"
        });
      }

      // Get subscriptions STRICTLY for the resolved customer
      logStep("📋 FETCHING SUBSCRIPTIONS FOR RESOLVED CUSTOMER ONLY", { customerId });
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: "all",
        expand: ['data.plan'],
        limit: 10,
      });
      
      // Log ALL subscriptions for this customer with creation dates
      subscriptions.data.forEach((sub, idx) => {
        logStep(`📄 SUBSCRIPTION ${idx+1} FOR CUSTOMER ${customerId}`, { 
          id: sub.id, 
          status: sub.status,
          created: sub.created,
          createdReadable: new Date(sub.created * 1000).toISOString(),
          current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
          metadata: sub.metadata,
          customer: sub.customer,
          planType: sub.metadata?.plan_type
        });
      });
      
      // Filter for active subscriptions
      const activeSubscriptions = subscriptions.data.filter(
        sub => ['active', 'trialing', 'past_due'].includes(sub.status)
      );
      
      logStep("🔍 ACTIVE SUBSCRIPTION FILTER", {
        totalSubscriptions: subscriptions.data.length,
        activeSubscriptions: activeSubscriptions.length,
        activeIds: activeSubscriptions.map(s => s.id)
      });
      
      const hasActiveSub = activeSubscriptions.length > 0;
      let subscriptionTier = null;
      let subscriptionEnd = null;
      let subscriptionId = null;

      if (hasActiveSub) {
        // FIXED: Sort by creation date (most recent first) instead of end date
        const subscription = activeSubscriptions.sort((a, b) => b.created - a.created)[0];
        
        subscriptionId = subscription.id;
        subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
        subscriptionTier = subscription.metadata?.plan_type || 'monthly';
        
        logStep("🎉 MOST RECENT SUBSCRIPTION SELECTED BY CREATION DATE", { 
          subscriptionId,
          created: new Date(subscription.created * 1000).toISOString(),
          endDate: subscriptionEnd,
          status: subscription.status,
          metadata: subscription.metadata,
          resolvedCustomerId: customerId,
          tier: subscriptionTier,
          sortedBy: "CREATION_DATE_DESCENDING",
          allActiveSubscriptions: activeSubscriptions.map(s => ({
            id: s.id,
            created: new Date(s.created * 1000).toISOString(),
            tier: s.metadata?.plan_type,
            endDate: new Date(s.current_period_end * 1000).toISOString()
          }))
        });
      } else {
        logStep("❌ NO ACTIVE SUBSCRIPTION FOR RESOLVED CUSTOMER", {
          resolvedCustomerId: customerId
        });
      }

      // Update Supabase with resolved customer data
      try {
        if (existingSubscriber) {
          logStep("📝 UPDATING EXISTING SUBSCRIBER WITH RESOLVED DATA", { 
            userId: user.id,
            id: existingSubscriber.id,
            newCustomerId: customerId
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
            logStep("💥 UPDATE ERROR", { error: updateError });
          } else {
            logStep("✅ SUCCESSFULLY UPDATED SUBSCRIBER RECORD");
          }
        } else {
          logStep("📝 CREATING NEW SUBSCRIBER RECORD", { 
            userId: user.id,
            customerId: customerId
          });
          
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
            logStep("💥 INSERT ERROR", { error: insertError });
          } else {
            logStep("✅ SUCCESSFULLY CREATED SUBSCRIBER RECORD");
          }
        }
      } catch (dbError) {
        logStep("💥 DATABASE ERROR", { error: dbError });
      }

      logStep("🏁 RETURNING FINAL SUBSCRIPTION INFO", { 
        subscribed: hasActiveSub, 
        subscriptionTier,
        subscriptionEnd,
        resolvedCustomerId: customerId,
        sortMethod: "CREATION_DATE_DESCENDING"
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
      logStep("💥 STRIPE ERROR - FALLBACK TO UNSUBSCRIBED", { error: stripeError.message });
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
    logStep("💥 CRITICAL ERROR", { message: errorMessage });
    
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


import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting mechanic payment setup...");
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization")!;
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }
    
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated");

    console.log("User authenticated:", user.email);

    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    console.log("Checking for existing customer...");
    
    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("Found existing customer:", customerId);
    } else {
      console.log("Creating new customer...");
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: user.id,
          user_type: 'mechanic'
        }
      });
      customerId = customer.id;
      console.log("Created new customer:", customerId);
    }

    console.log("Creating setup intent...");
    
    // Create setup intent for saving payment method
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
      usage: 'off_session',
    });

    console.log("Setup intent created:", setupIntent.id);

    // Create or update subscription record but don't start it yet
    const { error: subscriptionError } = await supabaseClient
      .from("mechanic_subscriptions")
      .upsert({
        mechanic_id: user.id,
        stripe_customer_id: customerId,
        subscription_status: 'pending',
        monthly_amount: 5000, // $50.00
        created_at: new Date().toISOString(),
      }, { onConflict: 'mechanic_id' });

    if (subscriptionError) {
      console.error("Subscription record error:", subscriptionError);
      // Don't throw here, as the setup intent is still valid
    }

    console.log("Payment setup completed successfully");

    return new Response(JSON.stringify({
      setup_intent_client_secret: setupIntent.client_secret,
      customer_id: customerId
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Payment setup error:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "Failed to setup payment method" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

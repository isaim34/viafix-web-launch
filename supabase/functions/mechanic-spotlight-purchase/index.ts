
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SPOTLIGHT_PACKAGES = {
  basic: { amount: 999, duration: 1 }, // $9.99 for 1 day
  premium: { amount: 6294, duration: 7 }, // $62.94 for 7 days
  enterprise: { amount: 23976, duration: 30 }, // $239.76 for 30 days
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting spotlight purchase...");
    
    const { spotlight_type } = await req.json();
    console.log("Spotlight type requested:", spotlight_type);
    
    if (!SPOTLIGHT_PACKAGES[spotlight_type]) {
      throw new Error(`Invalid spotlight package: ${spotlight_type}`);
    }

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

    // Get saved payment method
    const { data: paymentMethod } = await supabaseClient
      .from("mechanic_payment_methods")
      .select("stripe_payment_method_id, mechanic_id")
      .eq("mechanic_id", user.id)
      .eq("is_active", true)
      .single();

    if (!paymentMethod?.stripe_payment_method_id) {
      throw new Error("No payment method found. Please complete payment setup first.");
    }

    console.log("Found payment method for user");

    const package_info = SPOTLIGHT_PACKAGES[spotlight_type];
    const expires_at = new Date();
    expires_at.setDate(expires_at.getDate() + package_info.duration);

    console.log("Creating payment intent for amount:", package_info.amount);

    // Create payment intent and confirm it
    const paymentIntent = await stripe.paymentIntents.create({
      amount: package_info.amount,
      currency: 'usd',
      payment_method: paymentMethod.stripe_payment_method_id,
      confirmation_method: 'manual',
      confirm: true,
      off_session: true,
      description: `Spotlight ${spotlight_type} package - ${package_info.duration} day(s)`,
      metadata: {
        user_id: user.id,
        spotlight_type: spotlight_type,
        duration: package_info.duration.toString()
      }
    });

    console.log("Payment intent created and confirmed:", paymentIntent.id, "Status:", paymentIntent.status);

    // Record the purchase
    const { error: purchaseError } = await supabaseClient
      .from("mechanic_spotlight_purchases")
      .insert({
        mechanic_id: user.id,
        stripe_payment_intent_id: paymentIntent.id,
        amount: package_info.amount,
        status: paymentIntent.status,
        spotlight_type,
        expires_at: expires_at.toISOString(),
      });

    if (purchaseError) {
      console.error("Database error recording purchase:", purchaseError);
      throw purchaseError;
    }

    console.log("Spotlight purchase completed successfully");

    return new Response(JSON.stringify({
      success: true,
      payment_intent_id: paymentIntent.id,
      status: paymentIntent.status,
      spotlight_type: spotlight_type,
      expires_at: expires_at.toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Spotlight purchase error:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "Failed to purchase spotlight package" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

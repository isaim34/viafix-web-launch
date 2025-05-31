
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
    const { mechanic_id, trigger_reason } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Get mechanic subscription info
    const { data: subscription } = await supabaseClient
      .from("mechanic_subscriptions")
      .select("*")
      .eq("mechanic_id", mechanic_id)
      .single();

    if (!subscription || subscription.subscription_status === 'active') {
      return new Response(JSON.stringify({ message: "Subscription already active or not found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Get saved payment method
    const { data: paymentMethod } = await supabaseClient
      .from("mechanic_payment_methods")
      .select("stripe_payment_method_id")
      .eq("mechanic_id", mechanic_id)
      .eq("is_active", true)
      .single();

    if (!paymentMethod?.stripe_payment_method_id) {
      throw new Error("No active payment method found");
    }

    // Create Stripe subscription
    const stripeSubscription = await stripe.subscriptions.create({
      customer: subscription.stripe_customer_id,
      items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'ViaFix Mechanic Monthly Subscription',
          },
          unit_amount: subscription.monthly_amount,
          recurring: {
            interval: 'month',
          },
        },
      }],
      default_payment_method: paymentMethod.stripe_payment_method_id,
      expand: ['latest_invoice.payment_intent'],
    });

    // Update subscription record
    await supabaseClient
      .from("mechanic_subscriptions")
      .update({
        stripe_subscription_id: stripeSubscription.id,
        subscription_status: 'active',
        subscription_started_at: new Date().toISOString(),
        first_job_completed: trigger_reason === 'first_job',
        first_job_completed_at: trigger_reason === 'first_job' ? new Date().toISOString() : null,
      })
      .eq("mechanic_id", mechanic_id);

    return new Response(JSON.stringify({
      success: true,
      subscription_id: stripeSubscription.id,
      status: stripeSubscription.status,
      trigger_reason
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Subscription activation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

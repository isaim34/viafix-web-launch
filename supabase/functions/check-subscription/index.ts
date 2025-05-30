
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Simple check-subscription endpoint called");
    
    // For the simplified no-code approach, we'll return a basic response
    // In a real implementation, you might check subscription status differently
    // or integrate with Stripe's Customer Portal for subscription management
    
    return new Response(JSON.stringify({
      subscribed: false,
      subscription_tier: null,
      subscription_end: null,
      message: "Using Stripe no-code approach - manage subscriptions via Stripe Customer Portal"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error in check-subscription:", errorMessage);
    
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

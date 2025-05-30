
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log("Simple create-checkout endpoint called");
    
    // For the simplified no-code approach, we direct users to use Stripe Payment Links
    // This endpoint can be used for any custom logic you might need
    
    return new Response(JSON.stringify({ 
      message: "Using Stripe no-code approach with Payment Links",
      success: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error in create-checkout:", errorMessage);
    
    return new Response(JSON.stringify({ 
      error: 'An unexpected error occurred. Please try again.',
      success: false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  }
});


import { corsHeaders } from './cors.ts';

export const validateEnvironment = () => {
  const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  
  if (!stripeKey) {
    return {
      error: new Response(JSON.stringify({ 
        error: 'Payment service not configured',
        success: false
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    };
  }
  
  if (!supabaseUrl || !supabaseServiceRole) {
    return {
      error: new Response(JSON.stringify({ 
        error: 'Backend service not configured',
        success: false
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    };
  }

  return { stripeKey, supabaseUrl, supabaseServiceRole };
};

export const validateRequestBody = (requestBody: any) => {
  const { paymentType, quantity, planType, email: requestEmail } = requestBody;
  
  if (!paymentType) {
    return {
      error: new Response(JSON.stringify({ 
        error: 'Payment type is required',
        success: false
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    };
  }
  
  if (paymentType === 'subscription' && !planType) {
    return {
      error: new Response(JSON.stringify({ 
        error: 'Subscription plan is required',
        success: false
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    };
  }

  return { valid: true };
};

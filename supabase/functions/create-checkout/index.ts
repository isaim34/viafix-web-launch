
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

// Helper for improved logging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    logStep('Function started');
    
    // Get Stripe secret key from environment variables
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseServiceRole) {
      throw new Error('Supabase environment variables are not configured');
    }
    
    const supabaseClient = createClient(supabaseUrl, supabaseServiceRole);
    
    let userEmail: string | undefined;
    
    // Try to get user from auth header first (Supabase auth)
    const authHeader = req.headers.get('Authorization');
    
    if (authHeader && authHeader !== 'Bearer null') {
      try {
        logStep('Trying to authenticate with token');
        
        const token = authHeader.replace('Bearer ', '');
        const { data, error } = await supabaseClient.auth.getUser(token);
        
        if (error) {
          logStep('Auth error', { error: error.message });
          // Continue to local auth check
        } else if (data.user) {
          userEmail = data.user.email;
          logStep('User authenticated via Supabase', { userId: data.user.id, email: userEmail });
        }
      } catch (authError) {
        logStep('Error during Supabase authentication', { error: authError });
        // Continue to local auth check
      }
    }
    
    // Parse request body
    const requestBody = await req.json();
    
    // Explicitly extract data from the request body
    const { paymentType, quantity, planType, email: requestEmail } = requestBody;
    logStep('Request payload', { paymentType, quantity, planType, hasEmail: !!requestEmail });
    
    // If no user from Supabase auth, check the request body for email (local auth)
    if (!userEmail && requestEmail) {
      userEmail = requestEmail;
      logStep('Using email from request body', { email: userEmail });
    }
    
    // If still no user email, return error
    if (!userEmail) {
      throw new Error('Authentication required. Please sign in to continue.');
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    // Get or create Stripe customer
    logStep('Looking up customer', { email: userEmail });
    
    const customers = await stripe.customers.search({
      query: `email:'${userEmail}'`,
    });
    
    let customerId: string;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep('Found existing customer', { customerId });
    } else {
      const customer = await stripe.customers.create({
        email: userEmail,
      });
      customerId = customer.id;
      logStep('Created new customer', { customerId });
    }

    // Create checkout session based on payment type
    let session;
    
    if (paymentType === 'subscription') {
      // Using the actual price IDs from your Stripe dashboard
      const prices = {
        monthly: 'price_1RHQvyQ2fyi7p18OwHgMc713',    // $50/month
        quarterly: 'price_1RHQwmQ2fyi7p18OrDott3L3',  // $45/month (billed quarterly)
        biannual: 'price_1RHQxFQ2fyi7p18OKwn92RrR',   // $42.50/month (billed bi-annually)
        annual: 'price_1RHQyRQ2fyi7p18O0dUNCTo1',     // $40/month (billed annually)
      };

      if (!planType || !prices[planType as keyof typeof prices]) {
        throw new Error(`Invalid plan type: ${planType}`);
      }

      logStep('Creating subscription checkout', { 
        planType, 
        priceId: prices[planType as keyof typeof prices] 
      });
      
      // Get origin from request headers or set a default
      const origin = req.headers.get('origin') || req.headers.get('referer') || 'https://viafix-web.com';
      
      session = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items: [
          {
            price: prices[planType as keyof typeof prices],
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${origin}/mechanic-dashboard?success=subscription`,
        cancel_url: `${origin}/mechanic-dashboard?canceled=true`,
        subscription_data: {
          metadata: {
            plan_type: planType
          }
        }
      });
    } else {
      // One-off payment for featured listing or message packages
      const unitAmount = paymentType === 'featured' ? 2499 : 10;
      let finalAmount = unitAmount * (quantity || 1);
      
      // Apply discounts based on quantity
      if (paymentType === 'featured') {
        if (quantity >= 30) finalAmount = Math.floor(finalAmount * 0.8);
        else if (quantity >= 7) finalAmount = Math.floor(finalAmount * 0.9);
      } else {
        if (quantity >= 500) finalAmount = Math.floor(finalAmount * 0.8);
        else if (quantity >= 200) finalAmount = Math.floor(finalAmount * 0.9);
      }

      logStep('Creating one-off checkout', { 
        paymentType, 
        quantity, 
        unitAmount, 
        finalAmount 
      });
      
      // Get origin from request headers or set a default
      const origin = req.headers.get('origin') || req.headers.get('referer') || 'https://viafix-web.com';

      session = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: paymentType === 'featured' ? 'Featured Listing' : 'Message Package',
                description: paymentType === 'featured' 
                  ? `${quantity} days of featured listing`
                  : `${quantity} messages`,
              },
              unit_amount: finalAmount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${origin}/mechanic-dashboard?success=${paymentType}`,
        cancel_url: `${origin}/mechanic-dashboard?canceled=true`,
        payment_intent_data: {
          metadata: {
            payment_type: paymentType,
            quantity: quantity ? quantity.toString() : '1'
          }
        }
      });
    }

    logStep('Checkout session created', { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[CREATE-CHECKOUT] Error:', errorMessage);
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200, // Return 200 to avoid CORS issues, but include error in response
    });
  }
});

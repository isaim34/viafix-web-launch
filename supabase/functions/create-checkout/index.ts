
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
    let userId: string | undefined;
    
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
          userId = data.user.id;
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
        metadata: {
          user_id: userId || 'local_auth_user'
        }
      });
      customerId = customer.id;
      logStep('Created new customer', { customerId });
    }

    // Create checkout session based on payment type
    let session;
    
    if (paymentType === 'subscription') {
      // Calculate price amounts based on plan type
      const priceAmounts = {
        monthly: 5000,     // $50/month
        quarterly: 13500,  // $45/month (billed quarterly at $135)
        biannual: 25500,   // $42.50/month (billed bi-annually at $255)
        annual: 48000,     // $40/month (billed annually at $480)
      };
      
      const intervals = {
        monthly: 'month',
        quarterly: 'month', 
        biannual: 'month',
        annual: 'year'
      };
      
      const intervalCounts = {
        monthly: 1,
        quarterly: 3, 
        biannual: 6,
        annual: 1
      };
      
      if (!planType || !priceAmounts[planType as keyof typeof priceAmounts]) {
        throw new Error(`Invalid plan type: ${planType}`);
      }

      logStep('Creating subscription checkout', { planType });
      
      // Get origin from request headers or set a default
      const origin = req.headers.get('origin') || req.headers.get('referer') || 'https://viafix-web.com';
      
      const priceData = {
        currency: 'usd',
        product_data: {
          name: `ViaFix ${planType.charAt(0).toUpperCase() + planType.slice(1)} Subscription`,
          description: `Mechanic subscription plan (${planType})`,
          metadata: {
            plan_type: planType,
            user_id: userId || 'local_auth_user'
          }
        },
        unit_amount: priceAmounts[planType as keyof typeof priceAmounts],
        recurring: {
          interval: intervals[planType as keyof typeof intervals],
          interval_count: intervalCounts[planType as keyof typeof intervalCounts]
        }
      };
      
      logStep('Price data created', priceData);
      
      session = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items: [
          {
            price_data: priceData,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${origin}/mechanic-dashboard?success=subscription&plan=${planType}`,
        cancel_url: `${origin}/mechanic-dashboard?canceled=true`,
        subscription_data: {
          metadata: {
            plan_type: planType,
            user_id: userId || 'local_auth_user'
          }
        },
        client_reference_id: userId || userEmail, // Add reference for tracking
        automatic_tax: { enabled: false }
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
                metadata: {
                  payment_type: paymentType,
                  quantity: quantity ? quantity.toString() : '1',
                  user_id: userId || 'local_auth_user'
                }
              },
              unit_amount: finalAmount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${origin}/mechanic-dashboard?success=${paymentType}&quantity=${quantity}`,
        cancel_url: `${origin}/mechanic-dashboard?canceled=true`,
        payment_intent_data: {
          metadata: {
            payment_type: paymentType,
            quantity: quantity ? quantity.toString() : '1',
            user_id: userId || 'local_auth_user'
          }
        },
        client_reference_id: userId || userEmail // Add reference for tracking
      });
    }

    logStep('Checkout session created', { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url, session_id: session.id }), {
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

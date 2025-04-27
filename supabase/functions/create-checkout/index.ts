
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper for improved logging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
}

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    logStep('Function started');
    const { paymentType, quantity, planType } = await req.json()
    logStep('Request payload', { paymentType, quantity, planType });
    
    // Get user from auth header
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
    
    if (userError || !user) {
      logStep('Authentication failed', { error: userError });
      throw new Error('Not authenticated')
    }

    logStep('User authenticated', { userId: user.id, email: user.email });

    // Get or create Stripe customer
    logStep('Looking up customer', { email: user.email });
    const { data: customers } = await stripe.customers.search({
      query: `email:'${user.email}'`,
    })
    
    let customerId: string
    if (customers.length > 0) {
      customerId = customers[0].id
      logStep('Found existing customer', { customerId });
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabaseUUID: user.id,
        },
      })
      customerId = customer.id
      logStep('Created new customer', { customerId });
    }

    // Create checkout session based on payment type
    let session
    if (paymentType === 'subscription') {
      // Subscription prices (monthly base with different durations)
      const prices = {
        monthly: 'price_1RHQvyQ2fyi7p18OwHgMc713', // $50.00/month
        quarterly: 'price_1RHQwmQ2fyi7p18OrDott3L3', // $45.00/month (billed quarterly at $135)
        biannual: 'price_1RHQxFQ2fyi7p18OKwn92RrR', // $42.50/month (billed biannually at $255)
        annual: 'price_1RHQyRQ2fyi7p18O0dUNCTo1', // $40.00/month (billed annually at $480)
      }

      if (!planType || !prices[planType as keyof typeof prices]) {
        throw new Error(`Invalid plan type: ${planType}`);
      }

      logStep('Creating subscription checkout', { planType, priceId: prices[planType as keyof typeof prices] });
      
      session = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items: [
          {
            price: prices[planType as keyof typeof prices],
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${req.headers.get('origin')}/mechanic-dashboard?success=subscription`,
        cancel_url: `${req.headers.get('origin')}/mechanic-dashboard?canceled=true`,
        subscription_data: {
          metadata: {
            supabase_user_id: user.id,
            plan_type: planType
          }
        }
      })
    } else {
      // One-off payment for featured listing or message packages
      const unitAmount = paymentType === 'featured' ? 2499 : 10 // $24.99 for featured, $0.10 for messages
      let finalAmount = unitAmount * quantity
      
      // Apply discounts based on quantity
      if (paymentType === 'featured') {
        if (quantity >= 30) finalAmount = Math.floor(finalAmount * 0.8)
        else if (quantity >= 7) finalAmount = Math.floor(finalAmount * 0.9)
      } else {
        if (quantity >= 500) finalAmount = Math.floor(finalAmount * 0.8)
        else if (quantity >= 200) finalAmount = Math.floor(finalAmount * 0.9)
      }

      logStep('Creating one-off checkout', { 
        paymentType, 
        quantity, 
        unitAmount, 
        finalAmount 
      });

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
        success_url: `${req.headers.get('origin')}/mechanic-dashboard?success=${paymentType}`,
        cancel_url: `${req.headers.get('origin')}/mechanic-dashboard?canceled=true`,
        payment_intent_data: {
          metadata: {
            supabase_user_id: user.id,
            payment_type: paymentType,
            quantity: quantity.toString()
          }
        }
      })
    }

    logStep('Checkout session created', { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[CREATE-CHECKOUT] Error:', errorMessage);
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

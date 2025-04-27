
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { paymentType, quantity, planType } = await req.json()
    
    // Get user from auth header
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
    
    if (userError || !user) {
      throw new Error('Not authenticated')
    }

    // Get or create Stripe customer
    const { data: customers } = await stripe.customers.search({
      query: `email:'${user.email}'`,
    })
    
    let customerId: string
    if (customers.length > 0) {
      customerId = customers[0].id
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabaseUUID: user.id,
        },
      })
      customerId = customer.id
    }

    // Create checkout session based on payment type
    let session
    if (paymentType === 'subscription') {
      // Subscription prices (monthly base with different durations)
      const prices = {
        monthly: 'price_monthly', // Replace with actual price IDs from your Stripe dashboard
        quarterly: 'price_quarterly',
        biannual: 'price_biannual',
        annual: 'price_annual',
      }

      session = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items: [
          {
            price: prices[planType],
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${req.headers.get('origin')}/mechanic-dashboard?success=true`,
        cancel_url: `${req.headers.get('origin')}/mechanic-dashboard?canceled=true`,
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
        success_url: `${req.headers.get('origin')}/mechanic-dashboard?success=true`,
        cancel_url: `${req.headers.get('origin')}/mechanic-dashboard?canceled=true`,
      })
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

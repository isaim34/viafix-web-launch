
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { logStep } from '../utils/logging.ts';

export const createSubscriptionSession = async (
  stripe: Stripe,
  customerId: string,
  planType: string,
  userId: string | undefined,
  userEmail: string,
  origin: string
) => {
  const priceAmounts = {
    monthly: 4999,      // $49.99/month
    quarterly: 13497,   // $44.99/month (billed quarterly at $134.97)
    biannual: 25494,    // $42.49/month (billed bi-annually at $254.94)
    annual: 47988,      // $39.99/month (billed annually at $479.88)
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
  
  return await stripe.checkout.sessions.create({
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
    client_reference_id: userId || userEmail,
    automatic_tax: { enabled: false }
  });
};

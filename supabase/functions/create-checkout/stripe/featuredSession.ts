
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { logStep } from '../utils/logging.ts';

export const createFeaturedSession = async (
  stripe: Stripe,
  customerId: string,
  paymentType: string,
  quantity: number,
  userId: string | undefined,
  userEmail: string,
  origin: string
) => {
  const unitAmount = paymentType === 'featured' ? 999 : 10; // 999 cents = $9.99
  let finalAmount = unitAmount * (quantity || 1);
  
  // Apply discounts based on quantity
  if (paymentType === 'featured') {
    if (quantity >= 30) finalAmount = Math.floor(finalAmount * 0.8); // 20% discount for monthly
    else if (quantity >= 7) finalAmount = Math.floor(finalAmount * 0.9); // 10% discount for weekly
  }

  logStep('Creating featured listing checkout', { 
    paymentType, 
    quantity, 
    unitAmount, 
    finalAmount 
  });

  return await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: paymentType === 'featured' ? 'Featured Listing' : 'Legacy Product',
            description: paymentType === 'featured' 
              ? `${quantity} days of featured listing`
              : `${quantity} units`,
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
    client_reference_id: userId || userEmail
  });
};

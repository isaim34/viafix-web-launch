
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { logStep } from '../utils/logging.ts';

export const createMessageSession = async (
  stripe: Stripe,
  customerId: string,
  quantity: number,
  userId: string | undefined,
  userEmail: string,
  origin: string
) => {
  const messagePackages = {
    50: 4999,    // $49.99 for 50 messages
    200: 9999,   // $99.99 for 200 messages  
    500: 19999,  // $199.99 for 500 messages
  };
  
  const packageQuantity = quantity || 50;
  const unitAmount = messagePackages[packageQuantity as keyof typeof messagePackages];
  
  if (!unitAmount) {
    throw new Error(`Invalid message package: ${packageQuantity}`);
  }

  logStep('Creating message package checkout', { 
    paymentType: 'messages', 
    quantity: packageQuantity, 
    unitAmount
  });

  return await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Message Package',
            description: `${packageQuantity} messages`,
            metadata: {
              payment_type: 'messages',
              quantity: packageQuantity.toString(),
              user_id: userId || 'local_auth_user'
            }
          },
          unit_amount: unitAmount,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${origin}/mechanic-dashboard?success=messages&quantity=${packageQuantity}`,
    cancel_url: `${origin}/mechanic-dashboard?canceled=true`,
    payment_intent_data: {
      metadata: {
        payment_type: 'messages',
        quantity: packageQuantity.toString(),
        user_id: userId || 'local_auth_user'
      }
    },
    client_reference_id: userId || userEmail
  });
};

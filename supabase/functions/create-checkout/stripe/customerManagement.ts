
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { logStep } from '../utils/logging.ts';

export const getOrCreateStripeCustomer = async (stripe: Stripe, userEmail: string, userId?: string) => {
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

  return customerId;
};

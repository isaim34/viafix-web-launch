
import { supabase } from "@/integrations/supabase/client";

export const createCheckoutSession = async (options: {
  paymentType: 'subscription' | 'featured' | 'messages';
  quantity?: number;
  planType?: 'monthly' | 'quarterly' | 'biannual' | 'annual';
}) => {
  const { data, error } = await supabase.functions.invoke('create-checkout', {
    body: options
  });

  if (error) throw error;
  return data;
};

export const getCustomerPortal = async () => {
  const { data, error } = await supabase.functions.invoke('customer-portal');
  
  if (error) throw error;
  return data;
};

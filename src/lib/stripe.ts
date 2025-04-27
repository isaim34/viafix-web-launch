
import { supabase } from "@/integrations/supabase/client";

export const createCheckoutSession = async (options: {
  paymentType: 'subscription' | 'featured' | 'messages';
  quantity?: number;
  planType?: 'monthly' | 'quarterly' | 'biannual' | 'annual';
}) => {
  try {
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: options
    });

    if (error) {
      console.error("Checkout error:", error);
      throw new Error(`Failed to create checkout: ${error.message || "Unknown error"}`);
    }
    
    if (!data) {
      throw new Error("No data returned from checkout");
    }
    
    return data;
  } catch (err) {
    console.error("Error in createCheckoutSession:", err);
    throw err;
  }
};

export const getCustomerPortal = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('customer-portal');
    
    if (error) {
      console.error("Customer portal error:", error);
      throw new Error(`Failed to access customer portal: ${error.message || "Unknown error"}`);
    }
    
    if (!data) {
      throw new Error("No data returned from customer portal");
    }
    
    return data;
  } catch (err) {
    console.error("Error in getCustomerPortal:", err);
    throw err;
  }
};

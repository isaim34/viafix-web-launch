
import { supabase } from "@/integrations/supabase/client";

export interface CheckoutSessionOptions {
  paymentType: 'featured' | 'messages' | 'subscription';
  quantity?: number;
  planType?: string;
}

export const createCheckoutSession = async (options: CheckoutSessionOptions) => {
  try {
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: options
    });
    
    if (error) {
      console.error("Checkout session error:", error);
      return { 
        url: null, 
        error: error.message || "Failed to create checkout session" 
      };
    }
    
    if (!data.url) {
      throw new Error("No checkout URL returned");
    }
    
    return { url: data.url, error: null };
  } catch (err) {
    console.error("Error in createCheckoutSession:", err);
    return { 
      url: null, 
      error: err instanceof Error ? err.message : String(err) 
    };
  }
};

export const getCustomerPortal = async () => {
  try {
    const userEmail = localStorage.getItem('userEmail');
    
    if (!userEmail) {
      throw new Error('User email not found. Please log in.');
    }

    const { data, error } = await supabase.functions.invoke('customer-portal', {
      body: { email: userEmail }
    });
    
    if (error) {
      console.error("Customer portal error:", error);
      return { 
        url: null, 
        error: error.message || "Failed to access customer portal" 
      };
    }
    
    if (!data.url) {
      throw new Error("No portal URL returned");
    }
    
    return { url: data.url, error: null };
  } catch (err) {
    console.error("Error in getCustomerPortal:", err);
    return { 
      url: null, 
      error: err instanceof Error ? err.message : String(err) 
    };
  }
};

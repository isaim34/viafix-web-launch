
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
    // Get user email from localStorage or auth context
    const userEmail = localStorage.getItem('userEmail');
    
    if (!userEmail) {
      console.error("No user email found");
      throw new Error('User email not found. Please log in.');
    }
    
    console.log("Attempting to access customer portal for email:", userEmail);

    // Call the customer-portal function with the user's email
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
    
    if (data.adminAction) {
      return {
        url: null,
        error: data.error || "Stripe Customer Portal configuration required",
        adminAction: true
      };
    }
    
    if (!data.url) {
      throw new Error("No portal URL returned");
    }
    
    return { 
      url: data.url, 
      error: null,
      adminAction: false 
    };
  } catch (err) {
    console.error("Error in getCustomerPortal:", err);
    return { 
      url: null, 
      error: err instanceof Error ? err.message : String(err),
      adminAction: false
    };
  }
};

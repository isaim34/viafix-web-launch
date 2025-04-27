
import { supabase } from "@/integrations/supabase/client";

export interface CheckoutSessionOptions {
  paymentType: 'featured' | 'messages' | 'subscription';
  quantity?: number;
  planType?: string;
}

export const createCheckoutSession = async (options: CheckoutSessionOptions) => {
  try {
    console.log("Creating checkout session with options:", options);
    
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
    
    if (!data?.url) {
      console.error("No checkout URL in response:", data);
      throw new Error("No checkout URL returned");
    }
    
    console.log("Checkout session created successfully:", data.url);
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
      console.error("Customer portal supabase error:", error);
      return { 
        url: null, 
        error: error.message || "Failed to access customer portal",
        needsConfiguration: false
      };
    }
    
    console.log("Portal response:", data);
    
    // Check if the response contains a URL
    if (data?.url) {
      return { 
        url: data.url, 
        error: null,
        needsConfiguration: false
      };
    }
    
    // Handle case where there's an application error in the response
    if (data?.error) {
      console.error("Customer portal application error:", data.error);
      
      return {
        url: null,
        error: data.error,
        needsConfiguration: data.needsConfiguration || false,
        rawError: data.rawError // Pass through raw error for debugging
      };
    }
    
    // Fallback for unexpected response format
    return { 
      url: null, 
      error: "Unexpected response from portal service",
      needsConfiguration: false
    };
    
  } catch (err) {
    console.error("Error in getCustomerPortal:", err);
    return { 
      url: null, 
      error: err instanceof Error ? err.message : String(err),
      needsConfiguration: false
    };
  }
};

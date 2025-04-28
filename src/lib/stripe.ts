
import { supabase } from "@/integrations/supabase/client";

export interface CheckoutSessionOptions {
  paymentType: 'featured' | 'messages' | 'subscription';
  quantity?: number;
  planType?: string;
}

export const createCheckoutSession = async (options: CheckoutSessionOptions) => {
  try {
    console.log("Creating checkout session with options:", options);
    
    // Get current session directly from Supabase auth
    const { data, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Session error:", sessionError);
      return { 
        url: null, 
        error: "Authentication error. Please try signing in again.", 
        authError: true 
      };
    }
    
    if (!data.session || !data.session.user) {
      console.error("No active session found during checkout");
      return { 
        url: null, 
        error: "Please sign in to continue", 
        authError: true 
      };
    }

    // Call the checkout function
    const response = await supabase.functions.invoke('create-checkout', {
      body: options
    });
    
    if (response.error) {
      console.error("Checkout session error:", response.error);
      return { 
        url: null, 
        error: response.error.message || "Failed to create checkout session" 
      };
    }
    
    if (!response.data?.url) {
      console.error("No checkout URL in response:", response.data);
      throw new Error("No checkout URL returned");
    }
    
    console.log("Checkout session created successfully:", response.data.url);
    return { url: response.data.url, error: null };
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
    // Get current session directly from Supabase auth
    const { data, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Session error:", sessionError);
      return { 
        url: null, 
        error: "Authentication error. Please try signing in again.",
        authError: true
      };
    }
    
    if (!data.session || !data.session.user) {
      console.error("No active session found during portal access");
      return { 
        url: null, 
        error: "Please sign in to access your subscription",
        authError: true
      };
    }
    
    const userEmail = data.session.user.email;
    if (!userEmail) {
      console.error("User email not found in session");
      return { 
        url: null, 
        error: "User email not found. Please log in again." 
      };
    }
    
    console.log("Attempting to access customer portal for email:", userEmail);

    // Call the customer-portal function
    const response = await supabase.functions.invoke('customer-portal', {
      body: { email: userEmail }
    });
    
    if (response.error) {
      console.error("Customer portal error:", response.error);
      return { 
        url: null, 
        error: response.error.message || "Failed to access customer portal"
      };
    }
    
    if (!response.data?.url) {
      console.error("No portal URL in response:", response.data);
      return { 
        url: null, 
        error: response.data?.error || "Failed to create portal session"
      };
    }
    
    console.log("Portal access successful:", response.data.url);
    return { url: response.data.url, error: null };
  } catch (err) {
    console.error("Error in getCustomerPortal:", err);
    return { 
      url: null, 
      error: err instanceof Error ? err.message : String(err)
    };
  }
};

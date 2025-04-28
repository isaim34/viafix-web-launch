
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface CheckoutSessionOptions {
  paymentType: 'featured' | 'messages' | 'subscription';
  quantity?: number;
  planType?: string;
}

export const createCheckoutSession = async (options: CheckoutSessionOptions) => {
  try {
    console.log("Creating checkout session with options:", options);
    
    // Get current session - use getSession directly instead of relying on localStorage
    const { data: { session: authSession }, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error("Auth session error:", authError);
      return { 
        url: null, 
        error: "Authentication error. Please try signing in again.",
        authError: true
      };
    }
    
    // Check if the user is authenticated
    if (!authSession) {
      console.error("No active session found during checkout");
      return { 
        url: null, 
        error: "Please sign in to continue",
        authError: true
      };
    }

    // Call the checkout function with proper auth
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
    // Get current session - use getSession directly instead of relying on localStorage
    const { data: { session: authSession }, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error("Auth session error:", authError);
      return { 
        url: null, 
        error: "Authentication error. Please try signing in again.",
        authError: true
      };
    }
    
    // Check if the user is authenticated
    if (!authSession || !authSession.user) {
      console.error("No active session found during portal access");
      return { 
        url: null, 
        error: "Please sign in to access your subscription",
        authError: true
      };
    }
    
    const userEmail = authSession.user.email;
    if (!userEmail) {
      console.error("User email not found in session");
      return { 
        url: null, 
        error: "User email not found. Please log in again." 
      };
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
    
    if (!data?.url) {
      console.error("No portal URL in response:", data);
      return { 
        url: null, 
        error: data?.error || "Failed to create portal session"
      };
    }
    
    console.log("Portal access successful:", data.url);
    return { url: data.url, error: null };
  } catch (err) {
    console.error("Error in getCustomerPortal:", err);
    return { 
      url: null, 
      error: err instanceof Error ? err.message : String(err)
    };
  }
};

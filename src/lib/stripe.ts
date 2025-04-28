
import { supabase } from "@/integrations/supabase/client";

export interface CheckoutSessionOptions {
  paymentType: 'featured' | 'messages' | 'subscription';
  quantity?: number;
  planType?: string;
}

export const createCheckoutSession = async (options: CheckoutSessionOptions) => {
  try {
    console.log("Creating checkout session with options:", options);
    
    // Get current session
    const { data: { session: authSession }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Auth session error:", sessionError);
      return { 
        url: null, 
        error: "Please sign in to continue",
        authError: true
      };
    }
    
    // Additional check to confirm the user is authenticated
    if (!authSession) {
      console.warn("No active session found during checkout");
      // Check localStorage as a fallback to see if user thinks they're logged in
      const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
      const userEmail = localStorage.getItem('userEmail');
      
      if (userLoggedIn && userEmail) {
        console.warn("Local storage indicates user is logged in, but session is missing");
        return { 
          url: null, 
          error: "Your session has expired. Please refresh the page and try again.",
          authError: true
        };
      } else {
        return { 
          url: null, 
          error: "Please sign in to continue",
          authError: true
        };
      }
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

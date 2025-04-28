
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
    
    // If using Supabase auth and have a session
    if (data.session && data.session.user) {
      // Call the checkout function with Supabase auth
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
    } else {
      // Fallback to localStorage-based auth for development
      const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
      
      if (!userLoggedIn) {
        return { 
          url: null, 
          error: "Please sign in to continue", 
          authError: true 
        };
      }
      
      // Simulate checkout URL for development (replace with actual implementation)
      console.log("Using development mode checkout");
      return { 
        url: `https://checkout.stripe.com/demo?type=${options.paymentType}&plan=${options.planType || ''}`,
        error: null 
      };
    }
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
    
    // If using Supabase auth and have a session
    if (data.session && data.session.user) {
      const userEmail = data.session.user.email;
      if (!userEmail) {
        return { 
          url: null, 
          error: "User email not found. Please log in again." 
        };
      }
      
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
        return { 
          url: null, 
          error: response.data?.error || "Failed to create portal session"
        };
      }
      
      console.log("Portal access successful:", response.data.url);
      return { url: response.data.url, error: null };
    } else {
      // Fallback to localStorage for development
      const userEmail = localStorage.getItem('userEmail');
      
      if (!userEmail) {
        return { 
          url: null, 
          error: "User email not found. Please log in again.",
          authError: true
        };
      }
      
      // Simulate customer portal URL for development
      console.log("Using development mode portal for:", userEmail);
      return { 
        url: 'https://dashboard.stripe.com/test/customers', 
        error: null 
      };
    }
  } catch (err) {
    console.error("Error in getCustomerPortal:", err);
    return { 
      url: null, 
      error: err instanceof Error ? err.message : String(err)
    };
  }
};

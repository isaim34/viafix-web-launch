
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface CheckoutSessionOptions {
  paymentType: 'featured' | 'messages' | 'subscription';
  quantity?: number;
  planType?: string;
}

export const createCheckoutSession = async (options: CheckoutSessionOptions) => {
  try {
    console.log("Creating checkout session with options:", options);
    
    // Check if user is authenticated
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    let authToken = sessionData?.session?.access_token;
    let userEmail = sessionData?.session?.user?.email;
    
    // If no Supabase session, check if we're authenticated locally
    if (sessionError || !sessionData.session) {
      console.warn("No Supabase session found, checking local auth");
      
      const isLoggedInLocally = localStorage.getItem('userLoggedIn') === 'true';
      userEmail = localStorage.getItem('userEmail');
      
      if (!isLoggedInLocally || !userEmail) {
        console.error("No authentication found");
        return { 
          url: null, 
          error: "Authentication error. Please try signing in again.", 
          authError: true 
        };
      }
      
      // We'll still try to proceed with the function call
      console.log("Proceeding with local authentication", { userEmail });
    }
    
    // Always include the email in the request body for consistent authentication fallback
    const response = await supabase.functions.invoke('create-checkout', {
      body: {
        ...options,
        email: userEmail
      }
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
      
      // Check if there's an error message in the response
      if (response.data?.error) {
        return {
          url: null,
          error: response.data.error
        };
      }
      
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
    // Check if user is authenticated with Supabase
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    let userEmail;
    
    if (sessionError || !sessionData.session) {
      console.warn("No Supabase session found, checking local auth");
      
      const isLoggedInLocally = localStorage.getItem('userLoggedIn') === 'true';
      userEmail = localStorage.getItem('userEmail');
      
      if (!isLoggedInLocally || !userEmail) {
        console.error("No authentication found");
        return { 
          url: null, 
          error: "Authentication error. Please try signing in again.",
          authError: true
        };
      }
      
      console.log("Using local authentication with email:", userEmail);
    } else {
      userEmail = sessionData.session.user.email;
    }
    
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
  } catch (err) {
    console.error("Error in getCustomerPortal:", err);
    return { 
      url: null, 
      error: err instanceof Error ? err.message : String(err)
    };
  }
};

export const checkSubscription = async () => {
  try {
    // Check if user is authenticated with Supabase
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    let userEmail;
    
    if (sessionError || !sessionData.session) {
      console.warn("No Supabase session found, checking local auth");
      
      const isLoggedInLocally = localStorage.getItem('userLoggedIn') === 'true';
      userEmail = localStorage.getItem('userEmail');
      
      if (!isLoggedInLocally || !userEmail) {
        console.error("No authentication found");
        return { 
          subscribed: false, 
          error: "Authentication error. Please try signing in again.",
          authError: true
        };
      }
      
      console.log("Using local authentication with email:", userEmail);
      
      // Call the check-subscription function with email in the body
      const response = await supabase.functions.invoke('check-subscription', {
        body: { email: userEmail }
      });
      
      if (response.error) {
        console.error("Subscription check error:", response.error);
        return { 
          subscribed: false, 
          error: response.error.message || "Failed to check subscription status"
        };
      }
      
      // Store subscription info in localStorage for easy access
      if (response.data) {
        if (response.data.subscribed) {
          localStorage.setItem('subscription_status', 'active');
          localStorage.setItem('subscription_plan', response.data.subscription_tier || '');
          localStorage.setItem('subscription_end', response.data.subscription_end || '');
        } else {
          localStorage.setItem('subscription_status', 'inactive');
          localStorage.removeItem('subscription_plan');
          localStorage.removeItem('subscription_end');
        }
        
        // Dispatch storage event to notify components about the update
        window.dispatchEvent(new Event('storage-event'));
      }
      
      return { 
        subscribed: response.data?.subscribed || false,
        subscription_tier: response.data?.subscription_tier || null,
        subscription_end: response.data?.subscription_end || null,
        error: null
      };
    }
    
    // Use Supabase session authentication
    const response = await supabase.functions.invoke('check-subscription', {});
    
    if (response.error) {
      console.error("Subscription check error:", response.error);
      return { 
        subscribed: false, 
        error: response.error.message || "Failed to check subscription status"
      };
    }
    
    // Store subscription info in localStorage for easy access
    if (response.data) {
      if (response.data.subscribed) {
        localStorage.setItem('subscription_status', 'active');
        localStorage.setItem('subscription_plan', response.data.subscription_tier || '');
        localStorage.setItem('subscription_end', response.data.subscription_end || '');
      } else {
        localStorage.setItem('subscription_status', 'inactive');
        localStorage.removeItem('subscription_plan');
        localStorage.removeItem('subscription_end');
      }
      
      // Dispatch storage event to notify components about the update
      window.dispatchEvent(new Event('storage-event'));
    }
    
    return { 
      subscribed: response.data?.subscribed || false,
      subscription_tier: response.data?.subscription_tier || null,
      subscription_end: response.data?.subscription_end || null,
      error: null
    };
  } catch (err) {
    console.error("Error in checkSubscription:", err);
    return { 
      subscribed: false,
      error: err instanceof Error ? err.message : String(err)
    };
  }
};

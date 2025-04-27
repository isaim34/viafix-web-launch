
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
    console.log("Requesting customer portal access");
    
    // Create headers object with auth if available
    const headers: Record<string, string> = {};
    
    // Check if localStorage has user credentials we can use as fallback
    const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const userEmail = localStorage.getItem('userEmail');
    
    // Try to get Supabase session first
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (sessionData?.session?.access_token) {
      console.log("Found active Supabase session, using access token for authentication");
      headers.Authorization = `Bearer ${sessionData.session.access_token}`;
    } else if (userLoggedIn && userEmail) {
      // Fallback to using localStorage data in request body if no active session
      console.log("No active Supabase session found, using localStorage credentials as fallback");
    } else {
      console.error("No authentication method available");
      return { 
        url: null, 
        error: "You must be logged in to access subscription management" 
      };
    }

    // Make the request to the customer portal function
    const { data, error } = await supabase.functions.invoke('customer-portal', {
      headers,
      body: userEmail ? { email: userEmail } : undefined
    });
    
    if (error) {
      console.error("Customer portal error:", error);
      return { 
        url: null, 
        error: `Failed to access customer portal: ${error.message || "Unknown error"}` 
      };
    }
    
    if (!data || !data.url) {
      console.error("No portal URL returned", data);
      return { 
        url: null, 
        error: "No portal URL returned from server" 
      };
    }
    
    console.log("Successfully obtained customer portal URL");
    return { url: data.url, error: null };
  } catch (err) {
    console.error("Error in getCustomerPortal:", err);
    return { 
      url: null, 
      error: err instanceof Error ? err.message : String(err) 
    };
  }
};

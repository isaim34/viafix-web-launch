
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
    
    // Check if the user is authenticated
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      console.error("No active session found:", sessionError);
      return { 
        url: null, 
        error: "You must be logged in to access subscription management" 
      };
    }

    // Add the authentication token to the request
    const { data, error } = await supabase.functions.invoke('customer-portal', {
      headers: {
        Authorization: `Bearer ${sessionData.session.access_token}`
      }
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

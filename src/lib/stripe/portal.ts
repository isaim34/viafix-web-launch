
import { supabase } from "@/integrations/supabase/client";
import { PortalResult } from "./types";
import { checkLocalAuth } from "./utils";

export const getCustomerPortal = async (): Promise<PortalResult> => {
  try {
    // Check if user is authenticated with Supabase
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    let userEmail;
    
    if (sessionError || !sessionData.session) {
      console.warn("No Supabase session found, checking local auth");
      
      const { isLoggedInLocally, userEmail: localEmail } = checkLocalAuth();
      userEmail = localEmail;
      
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

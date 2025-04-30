
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CheckoutSessionOptions, CheckoutResult } from "./types";
import { checkLocalAuth } from "./utils";

export const createCheckoutSession = async (options: CheckoutSessionOptions): Promise<CheckoutResult> => {
  try {
    console.log("Creating checkout session with options:", options);
    
    // Check if user is authenticated
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    let authToken = sessionData?.session?.access_token;
    let userEmail = sessionData?.session?.user?.email;
    
    // If no Supabase session, check if we're authenticated locally
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

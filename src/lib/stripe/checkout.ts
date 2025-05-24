
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CheckoutSessionOptions, CheckoutResult } from "./types";
import { checkLocalAuth } from "./utils";

export const createCheckoutSession = async (options: CheckoutSessionOptions): Promise<CheckoutResult> => {
  try {
    console.log("Creating checkout session with options:", options);
    
    // Validate input options
    if (!options.paymentType) {
      console.error("Payment type is required");
      return { 
        url: null, 
        error: "Payment type is required" 
      };
    }
    
    if (options.paymentType === 'subscription' && !options.planType) {
      console.error("Plan type is required for subscription");
      return { 
        url: null, 
        error: "Subscription plan is required" 
      };
    }
    
    // Check if user is authenticated
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    let authToken = sessionData?.session?.access_token;
    let userEmail = sessionData?.session?.user?.email;
    
    console.log("Session check:", { 
      hasSession: !!sessionData?.session, 
      hasToken: !!authToken, 
      userEmail: userEmail 
    });
    
    // If no Supabase session, check if we're authenticated locally
    if (sessionError || !sessionData.session) {
      console.warn("No Supabase session found, checking local auth");
      
      const { isLoggedInLocally, userEmail: localEmail } = checkLocalAuth();
      userEmail = localEmail;
      
      console.log("Local auth check:", { isLoggedInLocally, userEmail });
      
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
    
    console.log("Calling Supabase edge function...");
    
    // Always include the email in the request body for consistent authentication fallback
    const requestBody = {
      ...options,
      email: userEmail
    };
    
    console.log("Request body:", requestBody);
    
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout
    
    try {
      const response = await supabase.functions.invoke('create-checkout', {
        body: requestBody,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);
      
      console.log("Edge function response:", response);
      
      if (response.error) {
        console.error("Checkout session error:", response.error);
        return { 
          url: null, 
          error: response.error.message || "Failed to create checkout session" 
        };
      }
      
      if (!response.data) {
        console.error("No data in response:", response);
        return {
          url: null,
          error: "No response data from checkout service"
        };
      }
      
      // Check if the response indicates an error
      if (response.data.success === false || response.data.error) {
        console.error("Error in response data:", response.data.error);
        return {
          url: null,
          error: response.data.error || "Checkout service error"
        };
      }
      
      if (!response.data.url) {
        console.error("No checkout URL in response:", response.data);
        return {
          url: null,
          error: "No checkout URL returned from service"
        };
      }
      
      console.log("Checkout session created successfully:", response.data.url);
      return { url: response.data.url, error: null };
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error("Network error calling edge function:", fetchError);
      
      if (fetchError.name === 'AbortError') {
        return { 
          url: null, 
          error: "Request timeout - please try again" 
        };
      }
      
      return { 
        url: null, 
        error: "Network error - please check your connection and try again" 
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

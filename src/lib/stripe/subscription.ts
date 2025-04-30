
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionResult } from "./types";
import { checkLocalAuth, updateLocalSubscriptionData } from "./utils";

export const checkSubscription = async (): Promise<SubscriptionResult> => {
  try {
    console.log("Checking subscription status...");
    
    // Check if user is authenticated with Supabase
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    let userEmail;
    
    if (sessionError || !sessionData.session) {
      console.log("No Supabase session found, checking local auth");
      
      const { isLoggedInLocally, userEmail: localEmail } = checkLocalAuth();
      userEmail = localEmail;
      
      if (!isLoggedInLocally || !userEmail) {
        console.error("No authentication found");
        return { 
          subscribed: false, 
          error: "Authentication error. Please try signing in again.",
          authError: true
        };
      }
      
      console.log("Using local authentication with email:", userEmail);
      
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      
      // Call the check-subscription function with email in the body
      const response = await supabase.functions.invoke('check-subscription', {
        body: { email: userEmail, timestamp },
        headers: { 'Cache-Control': 'no-cache' } // Prevent caching
      });
      
      if (response.error) {
        console.error("Subscription check error:", response.error);
        return { 
          subscribed: false, 
          error: response.error.message || "Failed to check subscription status"
        };
      }
      
      console.log("Received subscription data:", response.data);
      
      // Store subscription info in localStorage for easy access
      updateLocalSubscriptionData(response.data);
      
      return { 
        subscribed: response.data?.subscribed || false,
        subscription_tier: response.data?.subscription_tier || null,
        subscription_end: response.data?.subscription_end || null,
        error: null
      };
    }
    
    // Use Supabase session authentication
    console.log("Using Supabase authentication");
    
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    
    const response = await supabase.functions.invoke('check-subscription', {
      body: { timestamp }, // Add timestamp to prevent caching
      headers: { 'Cache-Control': 'no-cache' } // Prevent caching
    });
    
    if (response.error) {
      console.error("Subscription check error:", response.error);
      return { 
        subscribed: false, 
        error: response.error.message || "Failed to check subscription status"
      };
    }
    
    console.log("Received subscription data:", response.data);
    
    // Store subscription info in localStorage for easy access
    updateLocalSubscriptionData(response.data);
    
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

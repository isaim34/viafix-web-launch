
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionResult } from "./types";
import { checkLocalAuth, updateLocalSubscriptionData } from "./utils";

export const checkSubscription = async (): Promise<SubscriptionResult> => {
  try {
    console.log("🔍 Starting subscription check...");
    
    // Check local auth first
    const { isLoggedInLocally, userEmail } = checkLocalAuth();
    console.log("📱 Local auth check:", { isLoggedInLocally, hasEmail: !!userEmail });
    
    // Check if user is authenticated with Supabase
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    let authToken = sessionData?.session?.access_token;
    
    console.log("🔐 Auth check:", { 
      hasSession: !!sessionData?.session, 
      hasToken: !!authToken,
      hasLocalAuth: isLoggedInLocally,
      sessionError: sessionError?.message 
    });
    
    // Prefer Supabase session over local auth if available
    if (sessionData?.session && authToken && !sessionError) {
      console.log("✅ Using Supabase authentication");
      
      const userSessionEmail = sessionData.session.user.email;
      console.log("📧 User session email:", userSessionEmail);
      
      try {
        console.log("🚀 Calling check-subscription edge function...");
        const response = await Promise.race([
          supabase.functions.invoke('check-subscription', {
            body: { timestamp: new Date().getTime() },
            headers: { 
              'Authorization': `Bearer ${authToken}`
            }
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), 15000) // Reduced to 15s
          )
        ]) as any;
        
        console.log("📦 Edge function response:", response);
        
        if (response.error) {
          console.error("❌ Subscription check error:", response.error);
          return { 
            subscribed: false, 
            subscription_tier: null,
            subscription_end: null,
            error: "Unable to verify subscription status. Please try again later."
          };
        }
        
        // Store subscription info in localStorage
        updateLocalSubscriptionData(response.data);
        
        console.log("✅ Subscription check completed successfully");
        
        return { 
          subscribed: response.data?.subscribed || false,
          subscription_tier: response.data?.subscription_tier || null,
          subscription_end: response.data?.subscription_end || null,
          error: null
        };
      } catch (functionError) {
        console.error("❌ Edge function call failed:", functionError);
        return { 
          subscribed: false,
          subscription_tier: null,
          subscription_end: null,
          error: "Unable to connect to subscription service. Please try again later."
        };
      }
    }
    
    // Fall back to local auth if no valid Supabase session
    if (isLoggedInLocally && userEmail) {
      console.log("✅ Using local authentication with email:", userEmail);
      
      try {
        console.log("🚀 Calling check-subscription with local auth...");
        const response = await supabase.functions.invoke('check-subscription', {
          body: { 
            email: userEmail, 
            timestamp: new Date().getTime() 
          }
        });
        
        console.log("📦 Edge function response for local auth:", response);
        
        if (response.error) {
          console.error("❌ Subscription check error:", response.error);
          return { 
            subscribed: false, 
            subscription_tier: null,
            subscription_end: null,
            error: "Unable to verify subscription status. Please try again later."
          };
        }
        
        // Store subscription info in localStorage
        updateLocalSubscriptionData(response.data);
        
        console.log("✅ Subscription check completed successfully");
        
        return { 
          subscribed: response.data?.subscribed || false,
          subscription_tier: response.data?.subscription_tier || null,
          subscription_end: response.data?.subscription_end || null,
          error: null
        };
      } catch (functionError) {
        console.error("❌ Edge function call failed:", functionError);
        return { 
          subscribed: false,
          subscription_tier: null,
          subscription_end: null,
          error: "Unable to connect to subscription service. Please try again later."
        };
      }
    }
    
    // No authentication found
    console.error("❌ No authentication found");
    return { 
      subscribed: false, 
      error: "Authentication error. Please try signing in again.",
      authError: true
    };
  } catch (err) {
    console.error("❌ Error in checkSubscription:", err);
    return { 
      subscribed: false,
      error: err instanceof Error ? err.message : String(err)
    };
  }
};

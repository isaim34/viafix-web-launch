
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionResult } from "./types";
import { checkLocalAuth, updateLocalSubscriptionData } from "./utils";

export const checkSubscription = async (): Promise<SubscriptionResult> => {
  try {
    console.log("🔍 Starting subscription check...");
    
    // Check if user is authenticated with Supabase
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    let userEmail;
    let authToken = sessionData?.session?.access_token;
    
    console.log("🔐 Auth check:", { 
      hasSession: !!sessionData?.session, 
      hasToken: !!authToken,
      sessionError: sessionError?.message 
    });
    
    if (sessionError || !sessionData.session || !authToken) {
      console.log("📱 No valid Supabase session found, checking local auth");
      
      const { isLoggedInLocally, userEmail: localEmail } = checkLocalAuth();
      userEmail = localEmail;
      
      if (!isLoggedInLocally || !userEmail) {
        console.error("❌ No authentication found");
        return { 
          subscribed: false, 
          error: "Authentication error. Please try signing in again.",
          authError: true
        };
      }
      
      console.log("✅ Using local authentication with email:", userEmail);
      
      // Call edge function with email in body for local auth
      try {
        console.log("🚀 Calling check-subscription edge function with local auth...");
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
        
        // Store subscription info in localStorage for easy access
        updateLocalSubscriptionData(response.data);
        
        console.log("✅ Subscription check completed successfully:", {
          subscribed: response.data?.subscribed,
          tier: response.data?.subscription_tier,
          end: response.data?.subscription_end
        });
        
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
    
    // Use Supabase session authentication
    console.log("✅ Using Supabase authentication");
    
    const userSessionEmail = sessionData.session.user.email;
    console.log("📧 User session email:", userSessionEmail);
    
    // Call Stripe API with proper authorization
    try {
      console.log("🚀 Calling check-subscription edge function with Supabase auth...");
      const response = await Promise.race([
        supabase.functions.invoke('check-subscription', {
          body: { timestamp: new Date().getTime() },
          headers: { 
            'Authorization': `Bearer ${authToken}`
          }
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 30000)
        )
      ]) as any;
      
      console.log("📦 Edge function response with auth:", response);
      
      if (response.error) {
        console.error("❌ Subscription check error:", response.error);
        return { 
          subscribed: false, 
          subscription_tier: null,
          subscription_end: null,
          error: "Unable to verify subscription status. Please try again later."
        };
      }
      
      // Store subscription info in localStorage for easy access
      updateLocalSubscriptionData(response.data);
      
      console.log("✅ Subscription check completed successfully:", {
        subscribed: response.data?.subscribed,
        tier: response.data?.subscription_tier,
        end: response.data?.subscription_end
      });
      
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
  } catch (err) {
    console.error("❌ Error in checkSubscription:", err);
    return { 
      subscribed: false,
      error: err instanceof Error ? err.message : String(err)
    };
  }
};

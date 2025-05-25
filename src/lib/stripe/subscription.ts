
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionResult } from "./types";
import { checkLocalAuth, updateLocalSubscriptionData } from "./utils";

export const checkSubscription = async (): Promise<SubscriptionResult> => {
  try {
    console.log("Checking subscription status...");
    
    // Check if user is authenticated with Supabase
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    let userEmail;
    let authToken = sessionData?.session?.access_token;
    
    console.log("Auth check:", { 
      hasSession: !!sessionData?.session, 
      hasToken: !!authToken,
      sessionError: sessionError?.message 
    });
    
    if (sessionError || !sessionData.session || !authToken) {
      console.log("No valid Supabase session found, checking local auth");
      
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
      
      // For test accounts, return mock data without calling the edge function
      if (isTestAccount(userEmail)) {
        console.log("Test account detected, returning mock subscription data");
        const mockData = getMockSubscriptionData(userEmail);
        updateLocalSubscriptionData(mockData);
        return { 
          subscribed: mockData.subscribed,
          subscription_tier: mockData.subscription_tier,
          subscription_end: mockData.subscription_end,
          error: null
        };
      }
      
      // For local auth (non-test accounts), call edge function with email in body
      try {
        const response = await supabase.functions.invoke('check-subscription', {
          body: { 
            email: userEmail, 
            timestamp: new Date().getTime() 
          }
        });
        
        console.log("Edge function response for local auth:", response);
        
        if (response.error) {
          console.error("Subscription check error:", response.error);
          return { 
            subscribed: false, 
            subscription_tier: null,
            subscription_end: null,
            error: "Unable to verify subscription status. Please try again later."
          };
        }
        
        // Store subscription info in localStorage for easy access
        updateLocalSubscriptionData(response.data);
        
        return { 
          subscribed: response.data?.subscribed || false,
          subscription_tier: response.data?.subscription_tier || null,
          subscription_end: response.data?.subscription_end || null,
          error: null
        };
      } catch (functionError) {
        console.error("Edge function call failed:", functionError);
        return { 
          subscribed: false,
          subscription_tier: null,
          subscription_end: null,
          error: "Unable to connect to subscription service. Please try again later."
        };
      }
    }
    
    // Use Supabase session authentication
    console.log("Using Supabase authentication");
    
    const userSessionEmail = sessionData.session.user.email;
    
    // For test accounts with Supabase session, return mock data
    if (userSessionEmail && isTestAccount(userSessionEmail)) {
      console.log("Test account detected with session, returning mock subscription data");
      const mockData = getMockSubscriptionData(userSessionEmail);
      updateLocalSubscriptionData(mockData);
      return { 
        subscribed: mockData.subscribed,
        subscription_tier: mockData.subscription_tier,
        subscription_end: mockData.subscription_end,
        error: null
      };
    }
    
    try {
      // Call with proper authorization header and timeout
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
      
      console.log("Edge function response with auth:", response);
      
      if (response.error) {
        console.error("Subscription check error:", response.error);
        return { 
          subscribed: false, 
          subscription_tier: null,
          subscription_end: null,
          error: "Unable to verify subscription status. Please try again later."
        };
      }
      
      // Store subscription info in localStorage for easy access
      updateLocalSubscriptionData(response.data);
      
      return { 
        subscribed: response.data?.subscribed || false,
        subscription_tier: response.data?.subscription_tier || null,
        subscription_end: response.data?.subscription_end || null,
        error: null
      };
    } catch (functionError) {
      console.error("Edge function call failed:", functionError);
      return { 
        subscribed: false,
        subscription_tier: null,
        subscription_end: null,
        error: "Unable to connect to subscription service. Please try again later."
      };
    }
  } catch (err) {
    console.error("Error in checkSubscription:", err);
    return { 
      subscribed: false,
      error: err instanceof Error ? err.message : String(err)
    };
  }
};

// Helper function to detect test accounts
const isTestAccount = (email: string): boolean => {
  const testPatterns = [
    /test\./i,
    /demo\./i,
    /@example\.com$/i,
    /@test\.com$/i,
    /testmechanic/i,
    /testcustomer/i,
    /test_/i,
    /demo_/i
  ];
  
  return testPatterns.some(pattern => pattern.test(email));
};

// Helper function to return mock subscription data for test accounts
const getMockSubscriptionData = (email: string) => {
  console.log("Generating mock subscription data for:", email);
  
  // Return different mock data based on email pattern
  if (email.includes('premium') || email.includes('subscribed')) {
    return {
      subscribed: true,
      subscription_tier: 'monthly',
      subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
  } else if (email.includes('annual')) {
    return {
      subscribed: true,
      subscription_tier: 'annual',
      subscription_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    };
  } else {
    return {
      subscribed: false,
      subscription_tier: null,
      subscription_end: null
    };
  }
};


import { supabase } from '@/integrations/supabase/client';
import { PortalResult } from './types';
import { checkLocalAuth } from './utils';

/**
 * Get customer portal URL for managing subscriptions
 */
export const getCustomerPortal = async (): Promise<PortalResult> => {
  try {
    // First try Supabase authentication
    const { data } = await supabase.auth.getSession();
    
    // If no Supabase session, check local auth as fallback
    if (!data.session) {
      const { isLoggedInLocally, userEmail } = checkLocalAuth();
      
      if (!isLoggedInLocally || !userEmail) {
        return {
          url: null, 
          error: "Authentication required",
          authError: true
        };
      }
      
      console.log("Using local authentication for portal access");
    }

    // Call the Stripe customer portal function
    const response = await fetch('/api/customer-portal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return { 
        url: null, 
        error: errorData.error || `Server error: ${response.status}`
      };
    }
    
    const result = await response.json();
    return { 
      url: result.url, 
      error: null 
    };
  } catch (error) {
    console.error('Customer portal error:', error);
    return { 
      url: null, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

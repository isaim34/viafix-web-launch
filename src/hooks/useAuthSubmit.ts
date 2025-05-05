
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { getUserNameFromEmail } from '@/utils/authUtils';
import { persistUserToLocalStorage } from '@/contexts/auth/authUtils';

export interface AuthSubmitData {
  email: string;
  password: string;
}

export function useAuthSubmit() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSubmit = async (
    data: AuthSubmitData,
    isNewAccount: boolean
  ) => {
    try {
      setIsLoading(true);
      setAuthError(null);

      // If signing in (not creating a new account), check if the email exists in registration records
      if (!isNewAccount) {
        const isRegistered = localStorage.getItem(`registered_${data.email}`) !== null;
        
        // Check Supabase auth
        if (!isRegistered) {
          try {
            // Try to get the user's profile from Supabase to verify account exists
            // Using the correct API for listing users - note that this might require admin privileges
            // For regular applications, you would typically use signInWithPassword to check
            // But for this code, we'll use a safer approach that doesn't depend on admin APIs
            
            // First try to sign in with the credentials to check if the account exists
            const { error: signInError } = await supabase.auth.signInWithPassword({
              email: data.email,
              password: data.password,
            });
            
            if (signInError) {
              // If sign in fails, the account may not exist
              setAuthError("No account found for this email address. Please register first.");
              toast({
                title: "Sign in failed",
                description: "No account found for this email address. Please register first.",
                variant: "destructive"
              });
              setIsLoading(false);
              return false;
            }
            
            // If we reached here, the account exists, continue with the flow
            // Sign out immediately as we're just checking existence
            await supabase.auth.signOut();
            
          } catch (checkError) {
            console.log("Unable to verify account with Supabase, using local fallback");
          }
        }
      }

      // TEMPORARY: Using the existing simulation approach while also ensuring data persistence 
      // This would be replaced with actual Supabase auth in production
      const simulatedAuthData = {
        user: {
          id: 'temp-' + Math.random().toString(36).substring(2, 9),
          email: data.email
        }
      };
      
      // Get stored name or generate from email
      const storedName = localStorage.getItem(`registered_${data.email}`);
      const formattedUsername = getUserNameFromEmail(data.email);
      const userName = storedName || formattedUsername;
      
      // User role is 'mechanic' for this hook as it's used in MechanicSigninForm
      const userRole = 'mechanic';
      const userId = simulatedAuthData.user?.id;
      
      // Store all essential user data
      persistUserToLocalStorage({
        id: userId,
        email: data.email,
        role: userRole,
        name: userName
      });
      
      // Store email to userId mapping for lookup
      localStorage.setItem(`userId_to_email_${userId}`, data.email);
      
      // Store mechanic-specific data
      localStorage.setItem('vendorName', userName);
      
      // Set default subscription status for testing
      localStorage.setItem('subscription_status', 'active');
      localStorage.setItem('subscription_plan', 'monthly');
      localStorage.setItem('subscription_end', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString());
      
      // If this is a new account, store registration record
      if (isNewAccount) {
        localStorage.setItem(`registered_${data.email}`, userName);
      }
      
      // Ensure mechanic profile exists
      const mechanicProfileData = localStorage.getItem('mechanicProfile');
      if (!mechanicProfileData) {
        // Create a simple profile if none exists
        const profile = {
          firstName: userName.split(' ')[0] || '',
          lastName: userName.split(' ').slice(1).join(' ') || '',
          profileImage: ''
        };
        localStorage.setItem('mechanicProfile', JSON.stringify(profile));
      }
      
      // Notify components about authentication change
      window.dispatchEvent(new Event('storage-event'));
      
      const firstName = userName.split(' ')[0];
      
      toast({
        title: `Welcome${isNewAccount ? '' : ' back'}, ${firstName}!`,
        description: "You have successfully signed in.",
      });
      
      // Navigate to mechanic dashboard
      navigate('/mechanic-dashboard', { replace: true });
      return true;
      
    } catch (error) {
      console.error('Sign in error:', error);
      setAuthError("Failed to sign in. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSubmit,
    isLoading,
    authError,
    setAuthError
  };
}

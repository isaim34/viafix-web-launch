
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

      // If signing in (not creating a new account)
      if (!isNewAccount) {
        // Attempt to sign in with Supabase
        const { data: authData, error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        
        if (error) {
          setAuthError(error.message);
          toast({
            title: "Sign in failed",
            description: error.message,
            variant: "destructive"
          });
          setIsLoading(false);
          return false;
        }
        
        // Authentication successful
        if (authData.user) {
          // Get user name from metadata or generate from email
          const userName = authData.user.user_metadata?.name || 
                         authData.user.user_metadata?.full_name || 
                         getUserNameFromEmail(data.email);
          
          // Store the user role (assume mechanic for this hook)
          const userRole = 'mechanic';
          
          // Persist user info to local storage for app state
          persistUserToLocalStorage({
            id: authData.user.id,
            email: authData.user.email,
            role: userRole,
            name: userName
          });
          
          // Additional mechanic-specific data
          localStorage.setItem('vendorName', userName);
          
          // Trigger storage event to notify components of auth change
          window.dispatchEvent(new Event('storage-event'));
          
          const firstName = userName.split(' ')[0];
          
          toast({
            title: `Welcome back, ${firstName}!`,
            description: "You have successfully signed in.",
          });
          
          // Navigate to mechanic dashboard
          navigate('/mechanic-dashboard', { replace: true });
          return true;
        }
      } else {
        // Creating a new account
        const { data: authData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              full_name: getUserNameFromEmail(data.email),
              user_type: 'mechanic'
            }
          }
        });
        
        if (error) {
          setAuthError(error.message);
          toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive"
          });
          setIsLoading(false);
          return false;
        }
        
        if (authData.user) {
          const userName = getUserNameFromEmail(data.email);
          
          toast({
            title: "Account created successfully",
            description: "Check your email for a confirmation link to complete signup.",
          });
          
          navigate('/signin', { replace: true });
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Authentication error:', error);
      setAuthError("An unexpected error occurred. Please try again.");
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

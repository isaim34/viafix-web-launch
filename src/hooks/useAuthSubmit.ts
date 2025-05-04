
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { getUserNameFromEmail } from '@/utils/authUtils';

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

      // TEMPORARY: Skip actual auth and simulate successful login
      const simulatedAuthData = {
        user: {
          id: 'temp-' + Math.random().toString(36).substring(2, 9),
          email: data.email
        }
      };
      
      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('userRole', 'mechanic');
      
      const storedName = localStorage.getItem(`registered_${data.email}`);
      const formattedUsername = getUserNameFromEmail(data.email);
      const userName = storedName || formattedUsername;
      
      localStorage.setItem('userName', userName);
      const userId = simulatedAuthData.user?.id;
      localStorage.setItem('userId', userId);
      localStorage.setItem(`userId_to_email_${userId}`, data.email);
      localStorage.setItem('vendorName', userName);
      
      // Set default subscription status for testing
      localStorage.setItem('subscription_status', 'active');
      localStorage.setItem('subscription_plan', 'monthly');
      localStorage.setItem('subscription_end', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString());
      
      window.dispatchEvent(new Event('storage-event'));
      
      const firstName = userName.split(' ')[0];
      
      toast({
        title: `Welcome${isNewAccount ? '' : ' back'}, ${firstName}!`,
        description: "You have successfully signed in.",
      });
      
      navigate('/mechanic-dashboard', { replace: true });
      
    } catch (error) {
      console.error('Sign in error:', error);
      setAuthError("Failed to sign in. Please try again.");
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

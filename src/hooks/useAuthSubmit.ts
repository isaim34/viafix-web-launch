
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { getUserNameFromEmail } from '@/utils/authUtils';

interface AuthSubmitData {
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
      
      let authData, error;
      
      if (isNewAccount) {
        ({ data: authData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              user_type: 'mechanic',
            }
          }
        }));
      } else {
        ({ data: authData, error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password
        }));
      }
      
      if (error) throw error;
      
      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('userRole', 'mechanic');
      
      const storedName = localStorage.getItem(`registered_${data.email}`);
      const formattedUsername = getUserNameFromEmail(data.email);
      const userName = storedName || formattedUsername;
      
      localStorage.setItem('userName', userName);
      const userId = authData.user?.id || Math.random().toString(36).substring(2, 9);
      localStorage.setItem('userId', userId);
      localStorage.setItem(`userId_to_email_${userId}`, data.email);
      localStorage.setItem('vendorName', userName);
      
      // After successful login, check for subscription status
      try {
        const { data: subscriptions } = await supabase
          .from('vendor_subscriptions')
          .select('*')
          .eq('vendor_id', userId)
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (subscriptions && subscriptions.length > 0) {
          const subscription = subscriptions[0];
          localStorage.setItem('subscription_status', subscription.status);
          localStorage.setItem('subscription_plan', subscription.plan_type);
          
          if (subscription.current_period_end) {
            localStorage.setItem('subscription_end', subscription.current_period_end);
          }
        } else {
          localStorage.removeItem('subscription_status');
          localStorage.removeItem('subscription_plan');
          localStorage.removeItem('subscription_end');
        }
      } catch (subError) {
        console.error('Error fetching subscription data:', subError);
      }
      
      window.dispatchEvent(new Event('storage-event'));
      
      const firstName = userName.split(' ')[0];
      
      toast({
        title: `Welcome${isNewAccount ? '' : ' back'}, ${firstName}!`,
        description: "You have successfully signed in.",
      });
      
      navigate('/mechanic-dashboard', { replace: true });
    } catch (error) {
      console.error('Sign in error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Invalid login credentials')) {
          setAuthError("Account not found. Would you like to register instead?");
        } else {
          setAuthError(error.message);
        }
      } else {
        setAuthError("Failed to sign in");
      }
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

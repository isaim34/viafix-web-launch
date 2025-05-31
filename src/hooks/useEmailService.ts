
import { supabase } from '@/integrations/supabase/client';

interface EmailOptions {
  userId: string;
  userType: 'customer' | 'mechanic';
  email: string;
  firstName?: string;
  lastName?: string;
  subscriptionDetails?: {
    planType: string;
    amount: number;
    nextBilling: string;
  };
}

export const useEmailService = () => {
  const sendWelcomeEmail = async (options: EmailOptions) => {
    try {
      console.log('Sending welcome email...', options);
      
      const { data, error } = await supabase.functions.invoke('send-welcome-email', {
        body: options
      });

      if (error) {
        console.error('Failed to send welcome email:', error);
        throw error;
      }

      console.log('Welcome email sent successfully:', data);
      return data;
    } catch (error) {
      console.error('Email service error:', error);
      throw error;
    }
  };

  const sendSubscriptionConfirmation = async (options: EmailOptions & { subscriptionDetails: any }) => {
    try {
      console.log('Sending subscription confirmation email...', options);
      
      const { data, error } = await supabase.functions.invoke('send-welcome-email', {
        body: {
          ...options,
          userType: 'mechanic' // Subscription emails are always for mechanics
        }
      });

      if (error) {
        console.error('Failed to send subscription confirmation:', error);
        throw error;
      }

      console.log('Subscription confirmation sent successfully:', data);
      return data;
    } catch (error) {
      console.error('Email service error:', error);
      throw error;
    }
  };

  return {
    sendWelcomeEmail,
    sendSubscriptionConfirmation
  };
};

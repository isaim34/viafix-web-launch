
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from '@/hooks/use-toast';
import { persistUserToLocalStorage } from '@/contexts/auth/authUtils';
import { supabase } from '@/integrations/supabase/client';

const customerFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;

export const useCustomerSignin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  
  const redirectTo = location.state?.redirectTo || '/';
  const redirectAction = location.state?.action || null;
  
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: CustomerFormValues) => {
    setIsLoading(true);
    try {
      console.log("Processing sign in for:", data.email);
      
      // Attempt to sign in with Supabase
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });
      
      if (error) {
        console.error("Supabase sign in error:", error.message);
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive"
        });
        setIsLoading(false);
        return false;
      }
      
      if (authData.user) {
        // User authenticated successfully
        console.log("Supabase authentication successful");
        
        // Extract name from metadata or email
        const userName = authData.user.user_metadata?.full_name || 
                      authData.user.user_metadata?.name || 
                      data.email.split('@')[0];
        
        // Store user info in local storage
        persistUserToLocalStorage({
          id: authData.user.id,
          email: authData.user.email,
          role: 'customer',
          name: userName
        });
        
        // Create and store customer profile
        const profileData = {
          firstName: userName.split(' ')[0] || '',
          lastName: userName.split(' ').slice(1).join(' ') || '',
          profileImage: ''
        };
        
        localStorage.setItem('customerProfile', JSON.stringify(profileData));
        
        // Notify application of auth change
        window.dispatchEvent(new Event('storage-event'));
        console.log("Auth data stored, dispatched storage-event");
        
        // Get just the first name for the welcome message
        const firstName = userName.split(' ')[0];
        
        toast({
          title: `Welcome back, ${firstName}!`,
          description: "You have successfully signed in.",
        });
        
        // Handle redirect actions
        if (redirectAction) {
          setTimeout(() => {
            if (redirectAction === 'book') {
              toast({
                title: "You can now book services",
                description: "You've been signed in as a customer and can now book mechanic services.",
              });
            } else if (redirectAction === 'contact') {
              toast({
                title: "You can now chat with mechanics",
                description: "You've been signed in as a customer and can now chat with mechanics.",
              });
            }
          }, 500);
        }
        
        // Navigate to the redirect destination
        navigate(redirectTo, { replace: true });
        return true;
      }
      
      // If we reach here, authentication failed
      console.error("Sign in failed: No user returned");
      toast({
        title: "Sign in failed",
        description: "Authentication failed. Please check your credentials.",
        variant: "destructive"
      });
      return false;
      
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Sign in failed",
        description: "Please check your credentials and try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    onSubmit,
    redirectAction,
    isLoading
  };
}

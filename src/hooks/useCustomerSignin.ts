
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from '@/hooks/use-toast';
import { generateUserId, setupCustomerProfile } from '@/utils/authUtils';
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
      
      // Check if this user has registered before
      // First check local storage
      const isRegisteredLocally = localStorage.getItem(`registered_${data.email}`) !== null;
      
      let isRegistered = isRegisteredLocally;
      
      // If not registered locally, try to check with Supabase
      if (!isRegistered) {
        try {
          // Attempt to sign in with Supabase to verify account exists
          const { data: authData, error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password
          });
          
          if (authData?.user) {
            // Account exists in Supabase
            isRegistered = true;
            
            // Continue with the Supabase session if available
            if (authData.session) {
              // Let the AuthProvider handle the session via its listener
              console.log("Supabase authentication successful");
              
              // Ensure we have local records
              localStorage.setItem(`registered_${data.email}`, 
                authData.user.user_metadata?.full_name || 
                authData.user.user_metadata?.name || 
                data.email.split('@')[0]);
                
              toast({
                title: `Welcome back!`,
                description: "You have successfully signed in.",
              });
              
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
              
              setIsLoading(false);
              return true;
            }
          }
        } catch (supabaseError) {
          console.log("Unable to verify with Supabase, continuing with local auth");
        }
      }
      
      if (!isRegistered) {
        console.error("Sign in failed: User not registered");
        toast({
          title: "Sign in failed",
          description: "No account found for this email address. Please register first.",
          variant: "destructive"
        });
        setIsLoading(false);
        return false;
      }
      
      // Continue with local auth flow
      const userId = generateUserId(data.email);
      const { userName, profileData } = setupCustomerProfile(data.email, userId);
      
      // Store all essential user data
      persistUserToLocalStorage({
        id: userId,
        email: data.email,
        role: 'customer',
        name: userName
      });
      
      // Store customer profile data
      localStorage.setItem('customerProfile', JSON.stringify(profileData));
      
      // Store email to userId mapping
      localStorage.setItem(`userId_to_email_${userId}`, data.email);
      
      // Ensure we have a registration record
      if (!isRegisteredLocally) {
        localStorage.setItem(`registered_${data.email}`, userName);
      }
      
      // Dispatch event to update auth state
      window.dispatchEvent(new Event('storage-event'));
      console.log("Auth data stored, dispatched storage-event");
      
      // Get just the first name for the welcome message
      const firstName = userName.split(' ')[0];
      
      toast({
        title: `Welcome back, ${firstName}!`,
        description: "You have successfully signed in.",
      });
      
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

      return true;
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
};


import React, { useState } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import EmailField from '@/components/auth/EmailField';
import PasswordField from '@/components/auth/PasswordField';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateUserId, setupCustomerProfile } from '@/utils/authUtils';
import { useToast } from '@/hooks/use-toast';

// Form schema for customer login
const customerFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;

const CustomerSigninForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const redirectTo = location.state?.redirectTo || '/';
  const redirectAction = location.state?.action || null;
  
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: CustomerFormValues) => {
    try {
      setIsSubmitting(true);
      const userId = generateUserId(data.email);
      const { userName, profileData } = setupCustomerProfile(data.email, userId);
      
      // Store auth data
      localStorage.setItem('userId', userId);
      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('userRole', 'customer');
      localStorage.setItem('userName', userName);
      localStorage.setItem('customerProfile', JSON.stringify(profileData));
      
      // Store email to userId mapping
      localStorage.setItem(`userId_to_email_${userId}`, data.email);
      
      window.dispatchEvent(new Event('storage-event'));
      
      // Get just the first name for the welcome message
      const firstName = userName.split(' ')[0];
      
      toast({
        title: `Welcome back, ${firstName}!`,
        description: "You have successfully signed in.",
      });
      
      navigate(redirectTo);
      
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
    } catch (error) {
      console.error('Error during customer login:', error);
      toast({
        title: "Sign in failed",
        description: "There was an error signing you in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <EmailField form={form} />
        <PasswordField form={form} />

        <Button 
          type="submit" 
          className="w-full bg-[#6E59A5] hover:bg-[#7E69AB] text-white py-2 font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
        
        {redirectAction && (
          <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
            <p className="font-medium">Sign in required</p>
            <p>You need to sign in as a customer to {redirectAction === 'book' ? 'book services' : 'chat with mechanics'}.</p>
          </div>
        )}
        
        <div className="text-center text-sm pt-2">
          Don't have an account?{" "}
          <button 
            type="button" 
            className="text-[#6E59A5] hover:text-[#7E69AB] hover:underline font-medium transition-colors"
            onClick={() => navigate('/signup')}
          >
            Sign up
          </button>
        </div>
      </form>
    </Form>
  );
};

export default CustomerSigninForm;

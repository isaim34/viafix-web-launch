
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { LogIn } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast'; 
import EmailField from './auth/EmailField';
import PasswordField from './auth/PasswordField';
import { GoogleAuthButton } from './auth/GoogleAuthButton';
import { AuthTabs } from './auth/AuthTabs';
import { AuthError } from './auth/AuthError';

const mechanicFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type MechanicFormValues = z.infer<typeof mechanicFormSchema>;

const MechanicSigninForm = () => {
  const navigate = useNavigate();
  const [isNewAccount, setIsNewAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    
    if (error) {
      console.error('Auth redirect error:', error, errorDescription);
      setAuthError(errorDescription || 'Authentication failed. Please try again.');
    }
  }, []);
  
  const form = useForm<MechanicFormValues>({
    resolver: zodResolver(mechanicFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: MechanicFormValues) => {
    try {
      setIsLoading(true);
      setAuthError(null);

      // Simulate successful login
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
      const formattedUsername = data.email.split('@')[0];
      const userName = storedName || formattedUsername.charAt(0).toUpperCase() + formattedUsername.slice(1);
      
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
      
      toast({
        title: "Authentication failed",
        description: "Please check your credentials and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <AuthTabs 
        isNewAccount={isNewAccount} 
        onTabChange={setIsNewAccount} 
      />
      
      <h3 className="text-lg font-medium">
        {isNewAccount ? 'Create an Account' : 'Sign In to Your Account'}
      </h3>
      <p className="text-sm text-gray-500">
        {isNewAccount 
          ? 'Register as a mechanic to get started with ViaFix.' 
          : 'Enter your credentials to access your mechanic dashboard.'}
      </p>
      
      <GoogleAuthButton />
      
      <div className="relative flex items-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-500 text-sm">or continue with email</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <EmailField form={form} />
          <PasswordField form={form} />

          <AuthError 
            error={authError} 
            onRegisterClick={() => setIsNewAccount(true)} 
          />

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <LogIn className="mr-2 h-4 w-4" />
                <span>{isNewAccount ? "Register" : "Sign In"}</span>
              </div>
            )}
          </Button>
        </form>
      </Form>
      
      <div className="text-xs text-center text-gray-500 mt-4">
        By signing in, you agree to our{' '}
        <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and{' '}
        <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
      </div>
    </div>
  );
};

export default MechanicSigninForm;

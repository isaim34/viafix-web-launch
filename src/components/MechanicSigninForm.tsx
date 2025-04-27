import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { LogIn } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getUserNameFromEmail } from '@/utils/authUtils';
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
  const [isLoading, setIsLoading] = useState(false);
  const [isNewAccount, setIsNewAccount] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    
    if (error) {
      console.error('Auth redirect error:', error, errorDescription);
      setAuthError(errorDescription || 'Authentication failed. Please try again.');
    }
    
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (data.session && !error) {
        const userId = data.session.user.id;
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userRole', 'mechanic');
        localStorage.setItem('userId', userId);
        
        const userEmail = data.session.user.email;
        if (userEmail) {
          localStorage.setItem('userEmail', userEmail);
          localStorage.setItem(`userId_to_email_${userId}`, userEmail);
          
          const storedName = localStorage.getItem(`registered_${userEmail}`);
          const formattedUsername = getUserNameFromEmail(userEmail);
          const userName = storedName || formattedUsername;
          
          localStorage.setItem('userName', userName);
          localStorage.setItem('vendorName', userName);
        }
        
        window.dispatchEvent(new Event('storage-event'));
        navigate('/mechanic-dashboard', { replace: true });
      }
    };
    
    checkSession();
  }, [navigate]);
  
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

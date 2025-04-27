
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { LogIn } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import EmailField from './auth/EmailField';
import PasswordField from './auth/PasswordField';
import { GoogleAuthButton } from './auth/GoogleAuthButton';
import { AuthTabs } from './auth/AuthTabs';
import { AuthError } from './auth/AuthError';
import { useAuthSubmit } from '@/hooks/useAuthSubmit';

const mechanicFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type MechanicFormValues = z.infer<typeof mechanicFormSchema>;

const MechanicSigninForm = () => {
  const navigate = useNavigate();
  const [isNewAccount, setIsNewAccount] = useState(false);
  const { handleSubmit: handleAuthSubmit, isLoading, authError, setAuthError } = useAuthSubmit();
  
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
        navigate('/mechanic-dashboard', { replace: true });
      }
    };
    
    checkSession();
  }, [navigate, setAuthError]);
  
  const form = useForm<MechanicFormValues>({
    resolver: zodResolver(mechanicFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: MechanicFormValues) => {
    // Since we're using zod validation, we know that email and password will be defined
    // as non-optional strings exactly matching what handleAuthSubmit expects
    handleAuthSubmit({
      email: data.email,
      password: data.password
    }, isNewAccount);
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

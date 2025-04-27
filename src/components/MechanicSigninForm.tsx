import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { getUserNameFromEmail } from '@/utils/authUtils';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import EmailField from './auth/EmailField';
import PasswordField from './auth/PasswordField';

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
        // Sign up with Supabase
        ({ data: authData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              user_type: 'mechanic',
            }
          }
        }));
        
        if (error) throw error;
        
        if (authData?.user) {
          toast({
            title: "Account created successfully!",
            description: "You can now sign in with your new credentials.",
          });
          
          // Keep localStorage sync for backward compatibility
          localStorage.setItem('userEmail', data.email);
          localStorage.setItem('userLoggedIn', 'true');
          localStorage.setItem('userRole', 'mechanic');
          
          // Get stored name from localStorage for compatibility
          const storedName = localStorage.getItem(`registered_${data.email}`);
          const formattedUsername = getUserNameFromEmail(data.email);
          const userName = storedName || formattedUsername;
          
          localStorage.setItem('userName', userName);
          const userId = authData.user?.id || Math.random().toString(36).substring(2, 9);
          localStorage.setItem('userId', userId);
          localStorage.setItem(`userId_to_email_${userId}`, data.email);
          localStorage.setItem('vendorName', userName);
          
          window.dispatchEvent(new Event('storage-event'));
          
          toast({
            title: "Welcome to ViaFix!",
            description: "Your account has been created and you're now signed in.",
          });
          
          navigate('/mechanic-dashboard', { replace: true });
          return;
        }
      } else {
        // Sign in with Supabase
        ({ data: authData, error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password
        }));
        
        if (error) throw error;
      }
      
      // Keep localStorage sync for backward compatibility
      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('userRole', 'mechanic');
      
      // Get stored name from localStorage for compatibility
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
      
      // Handle specific authentication errors
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
      {/* Tab selection for Sign In vs Register */}
      <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
        <button 
          type="button" 
          className={`flex-1 py-2 text-center rounded-md transition-all ${!isNewAccount ? 'bg-white shadow' : ''}`}
          onClick={() => setIsNewAccount(false)}
        >
          Sign In
        </button>
        <button 
          type="button" 
          className={`flex-1 py-2 text-center rounded-md transition-all ${isNewAccount ? 'bg-white shadow' : ''}`}
          onClick={() => setIsNewAccount(true)}
        >
          Register
        </button>
      </div>
      
      <h3 className="text-lg font-medium">{isNewAccount ? 'Create an Account' : 'Sign In to Your Account'}</h3>
      <p className="text-sm text-gray-500">
        {isNewAccount 
          ? 'Register as a mechanic to get started with ViaFix.' 
          : 'Enter your credentials to access your mechanic dashboard.'}
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <EmailField form={form} />
          <PasswordField form={form} />

          {authError && (
            <Alert variant="destructive" className="text-sm">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{authError}</AlertDescription>
              {authError.includes("Account not found") && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => setIsNewAccount(true)}
                >
                  Register a new account
                </Button>
              )}
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : isNewAccount ? "Register" : "Sign In"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default MechanicSigninForm;

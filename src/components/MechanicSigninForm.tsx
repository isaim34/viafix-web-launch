
import React, { useState, useEffect } from 'react';
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
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
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
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isNewAccount, setIsNewAccount] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Check for authentication errors in URL parameters (like from OAuth redirect)
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    
    if (error) {
      console.error('Auth redirect error:', error, errorDescription);
      setAuthError(errorDescription || 'Authentication failed. Please try again.');
    }
    
    // Check for session on load (for OAuth redirects)
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (data.session && !error) {
        const userId = data.session.user.id;
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userRole', 'mechanic');
        localStorage.setItem('userId', userId);
        
        // Get user email and set up profile
        const userEmail = data.session.user.email;
        if (userEmail) {
          localStorage.setItem('userEmail', userEmail);
          localStorage.setItem(`userId_to_email_${userId}`, userEmail);
          
          // Get stored name or format from email
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

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      setAuthError(null);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/signin`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          data: {
            user_type: 'mechanic',
          }
        }
      });
      
      if (error) {
        console.error('Google auth error:', error);
        throw error;
      }
      
      // The redirect will happen automatically, no need to navigate
      // Fallback just in case
      if (!data.url) {
        setAuthError("Failed to start Google authentication flow.");
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      if (error instanceof Error) {
        setAuthError(error.message);
      } else {
        setAuthError("Failed to authenticate with Google");
      }
    } finally {
      setIsGoogleLoading(false);
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
      
      {/* Google Sign In Button */}
      <Button 
        type="button" 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading}
      >
        {isGoogleLoading ? (
          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : (
          <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
              <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
              <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
              <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
              <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
            </g>
          </svg>
        )}
        {isNewAccount ? 'Sign up with Google' : 'Sign in with Google'}
      </Button>
      
      <div className="relative flex items-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-500 text-sm">or continue with email</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      
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

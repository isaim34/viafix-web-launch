
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, Link } from 'react-router-dom';
import EmailField from '@/components/auth/EmailField';
import PasswordField from '@/components/auth/PasswordField';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';
import { z } from 'zod';
import { LogIn, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const mechanicFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required")
});

type MechanicFormValues = z.infer<typeof mechanicFormSchema>;

const MechanicSigninForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<MechanicFormValues>({
    resolver: zodResolver(mechanicFormSchema),
    defaultValues: {
      email: '',
      password: ''
    },
  });

  // Don't render the form if we're already logged in
  if (isLoggedIn) {
    return (
      <div className="p-6 text-center">
        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
        <p>Already signed in, redirecting...</p>
      </div>
    );
  }

  const handleSignin = async (data: MechanicFormValues) => {
    try {
      setIsLoading(true);
      console.log("Processing mechanic sign in for:", data.email);
      
      await signIn(data.email, data.password);
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      
      navigate('/mechanic-dashboard');
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast({
        title: "Sign in failed",
        description: error.message || "Invalid email or password",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">      
      <h3 className="text-lg font-medium">Mechanic Sign In</h3>
      <p className="text-sm text-gray-500">
        Enter your email and password to sign in to your mechanic account.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSignin)} className="space-y-6">
          <EmailField form={form} />
          <PasswordField 
            form={form} 
            name="password"
            label="Password"
            placeholder="Enter your password"
            required={true}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            <div className="flex items-center justify-center">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Sign In</span>
                </>
              )}
            </div>
          </Button>
          
          <div className="flex items-center justify-between">
            <Link to="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot your password?
            </Link>
            <Link to="/signup" className="text-sm text-primary hover:underline">
              Create account
            </Link>
          </div>
          
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <GoogleAuthButton userRole="mechanic" />
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

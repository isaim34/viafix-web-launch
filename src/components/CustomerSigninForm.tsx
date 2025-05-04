
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import EmailField from '@/components/auth/EmailField';
import PasswordField from '@/components/auth/PasswordField';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';
import { z } from 'zod';
import { LogIn } from 'lucide-react';
import { generateUserId, getUserNameFromEmail } from '@/utils/authUtils';
import { useCustomerSignin } from '@/hooks/useCustomerSignin';

const customerFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type CustomerFormValues = z.infer<typeof customerFormSchema>;

const CustomerSigninForm = () => {
  const { form, onSubmit } = useCustomerSignin();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (data: CustomerFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">      
      <h3 className="text-lg font-medium">Sign In to Your Account</h3>
      <p className="text-sm text-gray-500">
        Welcome back! Please enter your details.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <EmailField form={form} />
          <PasswordField form={form} />

          <Button type="submit" className="w-full" disabled={isLoading}>
            <div className="flex items-center justify-center">
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
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
          
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
          
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <GoogleAuthButton />
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

export default CustomerSigninForm;


import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { useNavigate, Link } from 'react-router-dom';
import ZipCodeInput from './ZipCodeInput';
import { customerFormSchema, CustomerFormValues } from '@/schemas/signupSchema';
import NameFields from './common/NameFields';
import LoginCredentialsFields from './common/LoginCredentialsFields';
import TermsOfServiceCheckbox from './common/TermsOfServiceCheckbox';
import { GoogleAuthButton } from './auth/GoogleAuthButton';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const CustomerSignupForm = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      zipCode: '',
      termsAccepted: false,
    },
  });

  const onSubmit = async (data: CustomerFormValues) => {
    try {
      console.log('Customer signup data:', data);
      
      // Use Supabase authentication
      const result = await signUp(data.email, data.password, {
        first_name: data.firstName,
        last_name: data.lastName,
        user_type: 'customer',
        zip_code: data.zipCode
      });
      
      if (result?.error) {
        throw new Error(result.error.message);
      }
      
      // Send welcome email after successful signup
      if (result?.data?.user) {
        try {
          console.log('Sending customer welcome email...');
          await supabase.functions.invoke('send-welcome-email', {
            body: {
              userId: result.data.user.id,
              userType: 'customer',
              email: data.email,
              firstName: data.firstName,
              lastName: data.lastName
            }
          });
          console.log('Welcome email sent successfully');
        } catch (emailError) {
          console.error('Failed to send welcome email:', emailError);
          // Don't block signup for email failures
        }
      }
      
      toast({
        title: "Account created!",
        description: `Welcome to ViaFix, ${data.firstName}. Please check your email to verify your account.`,
      });
      
      // Navigate to signin page after successful signup
      navigate('/signin?role=customer');
    } catch (error) {
      console.error('Signup error:', error);
      
      let errorMessage = "An unknown error occurred during signup.";
      
      if (error instanceof Error) {
        if (error.message.includes("weak") || error.message.includes("easy to guess")) {
          errorMessage = "Password is too common. Try adding numbers, special characters, or making it longer.";
        } else if (error.message.includes("breach") || error.message.includes("compromised")) {
          errorMessage = "This password has been found in data breaches. Please choose a different one.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <NameFields control={form.control} />
        <LoginCredentialsFields form={form} />
        <ZipCodeInput 
          control={form.control}
          description="Enter your zip code to find mechanics in your area"
        />
        <TermsOfServiceCheckbox control={form.control} />

        <Button type="submit" className="w-full">
          Create Customer Account
        </Button>
        
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/signin" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
        
        <div className="relative flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-sm">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <GoogleAuthButton mode="signup" />
      </form>
    </Form>
  );
};

export default CustomerSignupForm;

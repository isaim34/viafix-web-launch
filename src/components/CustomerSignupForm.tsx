
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

const CustomerSignupForm = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      zipCode: '',
      termsAccepted: false,
    },
  });

  const onSubmit = async (data: CustomerFormValues) => {
    try {
      console.log('Customer signup data:', data);
      
      // For testing - create account without password
      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('userRole', 'customer');
      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('userName', `${data.firstName} ${data.lastName}`);
      localStorage.setItem('userId', `customer-${Date.now()}`);
      
      // Create customer profile
      const profileData = {
        firstName: data.firstName,
        lastName: data.lastName,
        profileImage: ''
      };
      
      localStorage.setItem('customerProfile', JSON.stringify(profileData));
      
      // Trigger storage event to notify components
      window.dispatchEvent(new Event('storage-event'));
      
      toast({
        title: "Account created!",
        description: `Welcome to ViaFix, ${data.firstName}. Your customer account has been created successfully.`,
      });
      
      // Navigate to customer profile
      navigate('/customer-profile');
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "An unknown error occurred during signup.",
        variant: "destructive"
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <NameFields control={form.control} />
        <LoginCredentialsFields control={form.control} />
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

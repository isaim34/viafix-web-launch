
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { useNavigate, Link } from 'react-router-dom';
import ZipCodeInput from './ZipCodeInput';
import { baseUserSchema, BaseUserFormValues } from '@/schemas/signupSchema';
import NameFields from './common/NameFields';
import LoginCredentialsFields from './common/LoginCredentialsFields';
import TermsOfServiceCheckbox from './common/TermsOfServiceCheckbox';
import { GoogleAuthButton } from './auth/GoogleAuthButton';

const CustomerSignupForm = () => {
  const navigate = useNavigate();
  
  const form = useForm<BaseUserFormValues>({
    resolver: zodResolver(baseUserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      zipCode: '',
      termsAccepted: false,
    },
  });

  const onSubmit = (data: BaseUserFormValues) => {
    console.log('Customer signup data:', data);
    
    // Store the full name in localStorage for this demo
    // In a real app with Supabase, we would create the user account here
    const fullName = `${data.firstName} ${data.lastName}`;
    localStorage.setItem(`registered_${data.email}`, fullName);
    
    // Set up localStorage for authentication
    localStorage.setItem('userEmail', data.email);
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('userRole', 'customer');
    localStorage.setItem('userName', fullName);
    localStorage.setItem('userId', 'customer-' + Math.random().toString(36).substring(2, 9));
    
    window.dispatchEvent(new Event('storage-event'));
    
    toast({
      title: "Account created!",
      description: "Welcome to Mobex. Your customer account has been created successfully.",
    });
    
    // Navigate directly to customer profile/dashboard
    navigate('/profile');
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

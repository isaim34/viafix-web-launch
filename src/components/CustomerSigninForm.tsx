
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import EmailField from '@/components/auth/EmailField';
import PasswordField from '@/components/auth/PasswordField';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';
import { AuthTabs } from '@/components/auth/AuthTabs';
import { customerFormSchema, CustomerFormValues } from '@/schemas/signupSchema';
import NameFields from './common/NameFields';
import ZipCodeInput from './ZipCodeInput';
import TermsOfServiceCheckbox from './common/TermsOfServiceCheckbox';
import { LogIn } from 'lucide-react';

const CustomerSigninForm = () => {
  const [isNewAccount, setIsNewAccount] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
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

  const onSubmit = (data: CustomerFormValues) => {
    if (isNewAccount) {
      // Handle signup
      const fullName = `${data.firstName} ${data.lastName}`;
      localStorage.setItem(`registered_${data.email}`, fullName);
      
      toast({
        title: "Account created!",
        description: "Now let's set up two-factor authentication for your security.",
      });
      
      navigate('/two-factor-auth', { 
        state: { 
          userData: {
            ...data,
            fullName
          },
          userType: 'customer' 
        } 
      });
    } else {
      // Handle signin
      try {
        const userId = Math.random().toString(36).substring(2, 9);
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userRole', 'customer');
        localStorage.setItem('userId', userId);
        
        window.dispatchEvent(new Event('storage-event'));
        
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        
        navigate('/profile');
      } catch (error) {
        console.error('Sign in error:', error);
        toast({
          title: "Sign in failed",
          description: "Please check your credentials and try again.",
          variant: "destructive"
        });
      }
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
          ? 'Register as a customer to find and book mechanics.' 
          : 'Welcome back! Please enter your details.'}
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {isNewAccount && (
            <>
              <NameFields control={form.control} />
              <ZipCodeInput 
                control={form.control}
                description="Enter your zip code to find mechanics in your area"
              />
            </>
          )}
          
          <EmailField form={form} />
          <PasswordField form={form} />
          
          {isNewAccount && <TermsOfServiceCheckbox control={form.control} />}

          <Button type="submit" className="w-full">
            {isNewAccount ? (
              'Create Account'
            ) : (
              <div className="flex items-center">
                <LogIn className="mr-2 h-4 w-4" />
                <span>Sign In</span>
              </div>
            )}
          </Button>
          
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <GoogleAuthButton />
        </form>
      </Form>
    </div>
  );
};

export default CustomerSigninForm;

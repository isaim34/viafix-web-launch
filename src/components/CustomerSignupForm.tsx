
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import ZipCodeInput from './ZipCodeInput';
import { baseUserSchema, BaseUserFormValues } from '@/schemas/signupSchema';
import NameFields from './common/NameFields';
import LoginCredentialsFields from './common/LoginCredentialsFields';
import TermsOfServiceCheckbox from './common/TermsOfServiceCheckbox';

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
    // In a real app, this would be stored in a database
    const fullName = `${data.firstName} ${data.lastName}`;
    localStorage.setItem(`registered_${data.email}`, fullName);
    
    // Simulate API call for account creation
    toast({
      title: "Account created!",
      description: "Now let's set up two-factor authentication for your security.",
    });
    
    // Navigate to 2FA setup with user data
    navigate('/two-factor-auth', { 
      state: { 
        userData: {
          ...data,
          fullName
        },
        userType: 'customer' 
      } 
    });
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
      </form>
    </Form>
  );
};

export default CustomerSignupForm;

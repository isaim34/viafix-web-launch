
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
import { useAuth } from '@/contexts/AuthContext';

const CustomerSignupForm = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  
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

  const onSubmit = async (data: BaseUserFormValues) => {
    try {
      await signUp(
        data.email, 
        data.password, 
        'customer',
        data.firstName,
        data.lastName
      );
      
      toast({
        title: "Account created successfully",
        description: "Welcome to ViaFix!",
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Error creating account",
        description: error.message,
        variant: "destructive",
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
      </form>
    </Form>
  );
};

export default CustomerSignupForm;

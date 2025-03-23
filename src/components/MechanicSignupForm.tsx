
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import ZipCodeInput from './ZipCodeInput';
import { mechanicFormSchema, MechanicFormValues } from '@/schemas/signupSchema';
import NameFields from './common/NameFields';
import LoginCredentialsFields from './common/LoginCredentialsFields';
import TermsOfServiceCheckbox from './common/TermsOfServiceCheckbox';
import MechanicSpecificFields from './mechanic/MechanicSpecificFields';

const MechanicSignupForm = () => {
  const navigate = useNavigate();
  
  const form = useForm<MechanicFormValues>({
    resolver: zodResolver(mechanicFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      zipCode: '',
      specialties: '',
      hourlyRate: '',
      termsAccepted: false,
    },
  });

  const onSubmit = (data: MechanicFormValues) => {
    console.log('Mechanic signup data:', data);
    
    // Simulate API call for account creation
    toast({
      title: "Account created!",
      description: "Now let's set up two-factor authentication for your security.",
    });
    
    // Navigate to 2FA setup with user data
    navigate('/two-factor-auth', { 
      state: { 
        userData: data,
        userType: 'mechanic' 
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
          description="Enter your zip code to help customers find you"
        />
        <MechanicSpecificFields control={form.control} />
        <TermsOfServiceCheckbox control={form.control} />

        <Button type="submit" className="w-full">
          Create Mechanic Account
        </Button>
      </form>
    </Form>
  );
};

export default MechanicSignupForm;

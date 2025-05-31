
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import ZipCodeInput from './ZipCodeInput';
import { mechanicFormSchema, MechanicFormValues } from '@/schemas/signupSchema';
import NameFields from './common/NameFields';
import LoginCredentialsFields from './common/LoginCredentialsFields';
import TermsOfServiceCheckbox from './common/TermsOfServiceCheckbox';
import MechanicSpecificFields from './mechanic/MechanicSpecificFields';
import { GoogleAuthButton } from './auth/GoogleAuthButton';
import { useAuth } from '@/hooks/useAuth';
import { PaymentSetupModal } from './mechanic/PaymentSetupModal';
import { supabase } from '@/integrations/supabase/client';

const MechanicSignupForm = () => {
  const { signUp } = useAuth();
  const [showPaymentSetup, setShowPaymentSetup] = useState(false);
  const [signupData, setSignupData] = useState<MechanicFormValues | null>(null);
  
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

  const onSubmit = async (data: MechanicFormValues) => {
    try {
      console.log('Mechanic signup data:', data);
      
      // Create account with Supabase authentication
      const userData = {
        first_name: data.firstName,
        last_name: data.lastName,
        user_type: 'mechanic',
        zip_code: data.zipCode,
        specialties: data.specialties,
        hourly_rate: data.hourlyRate
      };
      
      const result = await signUp(data.email, data.password, userData);
      
      if (result?.error) {
        throw new Error(result.error.message);
      }
      
      // Send initial mechanic welcome email after successful signup
      if (result?.data?.user) {
        try {
          console.log('Sending mechanic welcome email...');
          await supabase.functions.invoke('send-welcome-email', {
            body: {
              userId: result.data.user.id,
              userType: 'mechanic',
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
      
      // Store signup data and show payment setup
      setSignupData(data);
      setShowPaymentSetup(true);
      
    } catch (error: any) {
      console.error('Signup error:', error);
      
      let errorMessage = "An error occurred during signup.";
      
      if (error.message) {
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

  const handlePaymentSetupComplete = () => {
    setShowPaymentSetup(false);
    toast({
      title: "Welcome to ViaFix!",
      description: `Account created successfully! Your $50/month subscription will start after you complete your first job.`,
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <NameFields control={form.control} />
          <LoginCredentialsFields form={form} />
          <ZipCodeInput 
            control={form.control}
            description="Enter your zip code to help customers find you"
          />
          <MechanicSpecificFields control={form.control} />
          <TermsOfServiceCheckbox control={form.control} />

          <Button type="submit" className="w-full">
            Create Mechanic Account
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

      <PaymentSetupModal 
        isOpen={showPaymentSetup}
        onClose={() => setShowPaymentSetup(false)}
        onComplete={handlePaymentSetupComplete}
        mechanicData={signupData}
      />
    </>
  );
};

export default MechanicSignupForm;

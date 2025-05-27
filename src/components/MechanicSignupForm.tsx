
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { useNavigate, Link } from 'react-router-dom';
import ZipCodeInput from './ZipCodeInput';
import { mechanicFormSchema, MechanicFormValues } from '@/schemas/signupSchema';
import NameFields from './common/NameFields';
import LoginCredentialsFields from './common/LoginCredentialsFields';
import TermsOfServiceCheckbox from './common/TermsOfServiceCheckbox';
import MechanicSpecificFields from './mechanic/MechanicSpecificFields';
import { GoogleAuthButton } from './auth/GoogleAuthButton';
import { useAuth } from '@/hooks/useAuth';

const MechanicSignupForm = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  
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
      
      await signUp(data.email, data.password, userData);
      
      toast({
        title: "Account created!",
        description: `Welcome to ViaFix, ${data.firstName}. Please check your email to verify your account.`,
      });
      
      // Navigate to sign in page for email verification
      navigate('/signin');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Signup failed",
        description: error.message || "An error occurred during signup.",
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
  );
};

export default MechanicSignupForm;

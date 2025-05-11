
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import EmailField from '@/components/auth/EmailField';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';
import { z } from 'zod';
import { LogIn, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { persistUserToLocalStorage } from '@/contexts/auth/authUtils';
import { getUserNameFromEmail } from '@/utils/authUtils';

const mechanicFormSchema = z.object({
  email: z.string().email("Please enter a valid email address")
});

type MechanicFormValues = z.infer<typeof mechanicFormSchema>;

const MechanicSigninForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { authChecked, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Log auth state for debugging
  React.useEffect(() => {
    console.log("MechanicSigninForm auth state:", { authChecked, isLoggedIn });
  }, [authChecked, isLoggedIn]);

  // Don't render the form if we're already logged in
  if (isLoggedIn) {
    return (
      <div className="p-6 text-center">
        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
        <p>Already signed in, redirecting...</p>
      </div>
    );
  }
  
  const form = useForm<MechanicFormValues>({
    resolver: zodResolver(mechanicFormSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleQuickSignin = async (data: MechanicFormValues) => {
    try {
      setIsLoading(true);
      console.log("Processing quick sign in for:", data.email);
      
      // Set up local authentication for testing
      const userName = getUserNameFromEmail(data.email);
      
      // Store auth data
      persistUserToLocalStorage({
        id: `temp-${Date.now()}`,
        email: data.email,
        role: 'mechanic',
        name: userName
      });
      
      // Set additional mechanic data
      localStorage.setItem('vendorName', userName);
      
      // Create profile info
      const profile = {
        firstName: userName.split(' ')[0] || '',
        lastName: userName.split(' ').slice(1).join(' ') || '',
        specialties: 'General Auto Repair',
        hourlyRate: '75',
        profileImage: ''
      };
      localStorage.setItem('mechanicProfile', JSON.stringify(profile));
      
      // Notify app of auth change
      window.dispatchEvent(new Event('storage-event'));
      
      toast({
        title: "Quick Testing Mode",
        description: `Signed in as ${userName}. You can now access mechanic features.`,
      });
      
      // Navigate to mechanic dashboard
      navigate('/mechanic-dashboard');
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Sign in failed",
        description: "An error occurred during the sign in process.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">      
      <h3 className="text-lg font-medium">Quick Mechanic Sign In</h3>
      <p className="text-sm text-gray-500">
        Enter your email to sign in or create a mechanic account.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleQuickSignin)} className="space-y-6">
          <EmailField form={form} />

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
                  <span>Quick Sign In as Mechanic</span>
                </>
              )}
            </div>
          </Button>
          
          <p className="text-center text-sm text-gray-500 italic">
            For testing only - no password required
          </p>
          
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <GoogleAuthButton userRole="mechanic" />
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

export default MechanicSigninForm;

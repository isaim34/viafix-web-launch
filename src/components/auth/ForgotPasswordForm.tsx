
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm = () => {
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    setIsSubmitting(true);
    try {
      await resetPassword(data.email);
      setEmailSent(true);
      toast({
        title: "Reset email sent",
        description: "Check your email for a link to reset your password. It may take a few minutes to arrive.",
      });
    } catch (error) {
      console.error('Reset password error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while sending the reset email.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (emailSent) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-medium text-center">Email Sent</h3>
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            We have sent you an email with a link to reset your password. Please check your inbox.
          </AlertDescription>
        </Alert>
        <p className="text-center text-sm text-gray-500">
          Didn't receive an email? Check your spam folder or try again.
        </p>
        <div className="flex flex-col space-y-3">
          <Button
            variant="ghost"
            onClick={() => form.reset()}
            className="mt-2"
            type="button"
            onClick={() => setEmailSent(false)}
          >
            Try again
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/signin')}
            className="mt-2"
          >
            Return to sign in
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-medium">Reset Password</h3>
        <p className="text-sm text-gray-500 mt-2">
          Enter your email and we'll send you a link to reset your password
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email<span className="text-destructive ml-1">*</span></FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      type="email" 
                      placeholder="Enter your email address" 
                      className="pl-10"
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                <span>Sending...</span>
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center">
        <Link to="/signin" className="inline-flex items-center text-sm text-primary hover:text-primary/90">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to sign in
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;

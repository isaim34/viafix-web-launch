
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be less than 72 characters"),
  confirmPassword: z.string()
    .min(8, "Password must be at least 8 characters")
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    // Check if we have the hash fragment with access_token
    const hash = window.location.hash;
    if (!hash || !hash.includes('access_token')) {
      setResetError('Invalid or expired password reset link. Please request a new password reset link.');
    }
  }, []);

  const onSubmit = async (data: ResetPasswordValues) => {
    setIsLoading(true);
    try {
      // Update user's password
      const { error } = await supabase.auth.updateUser({
        password: data.password
      });

      if (error) throw error;
      
      setResetSuccess(true);
      toast({
        title: "Password reset successful",
        description: "Your password has been successfully reset.",
      });
      
      // Redirect to signin after 3 seconds
      setTimeout(() => {
        navigate('/signin');
      }, 3000);
    } catch (error) {
      console.error('Reset password error:', error);
      setResetError(error instanceof Error ? error.message : "An error occurred while resetting your password");
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while resetting your password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (resetError) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
          >
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{resetError}</AlertDescription>
            </Alert>
            <div className="text-center">
              <Button onClick={() => navigate('/forgot-password')}>
                Request New Reset Link
              </Button>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  if (resetSuccess) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
          >
            <Alert className="bg-green-50 border-green-200 mb-6">
              <AlertTitle className="text-green-800">Success!</AlertTitle>
              <AlertDescription className="text-green-700">
                Your password has been successfully reset. You will be redirected to the sign in page shortly.
              </AlertDescription>
            </Alert>
            <div className="text-center">
              <Button onClick={() => navigate('/signin')}>
                Go to Sign In
              </Button>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <div className="border p-6 rounded-lg shadow-sm bg-gray-50">
            <div className="text-center mb-6">
              <h3 className="text-xl font-medium">Set New Password</h3>
              <p className="text-sm text-gray-500 mt-2">
                Create a new password for your account
              </p>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password<span className="text-destructive ml-1">*</span></FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Enter new password" 
                            className="pl-10" 
                            {...field} 
                          />
                          <button 
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Must be at least 8 characters long
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password<span className="text-destructive ml-1">*</span></FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input 
                            type={showConfirmPassword ? "text" : "password"} 
                            placeholder="Confirm new password" 
                            className="pl-10" 
                            {...field} 
                          />
                          <button 
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      <span>Setting password...</span>
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ResetPassword;

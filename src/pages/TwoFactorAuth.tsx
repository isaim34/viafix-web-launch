
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from '@/hooks/use-toast';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const phoneSchema = z.object({
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
});

const TwoFactorAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>('email');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  
  // Get user data from location state (passed from signup)
  const userData = location.state?.userData || {};
  const userType = location.state?.userType || 'customer';

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: '',
    },
  });

  const handleSendCode = () => {
    // For email verification, we'd use the email from userData
    // For phone, we'd use the phone number from the form
    
    if (activeTab === 'phone' && !phoneForm.formState.isValid) {
      phoneForm.trigger();
      return;
    }
    
    const contactMethod = activeTab === 'email' ? userData.email : phoneForm.getValues().phoneNumber;
    
    // In a real implementation, this would call an API to send the code
    console.log(`Sending 2FA code to ${contactMethod} via ${activeTab}`);
    
    toast({
      title: "Verification code sent!",
      description: `A code has been sent to your ${activeTab === 'email' ? 'email' : 'phone'}`,
    });
    
    setOtpSent(true);
  };

  const handleVerifyCode = () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter the complete 6-digit code",
        variant: "destructive",
      });
      return;
    }
    
    // In a real implementation, this would validate the OTP with an API
    console.log(`Verifying 2FA code: ${otp}`);
    
    // Simulate verification success
    toast({
      title: "Verification successful!",
      description: "Your account has been secured with 2FA",
    });
    
    // Redirect based on user type
    if (userType === 'mechanic') {
      navigate('/mechanic/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <Layout>
      <div className="container max-w-md mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!otpSent ? (
                <>
                  <Tabs 
                    defaultValue="email" 
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full mb-6"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="email">Email</TabsTrigger>
                      <TabsTrigger value="phone">Phone</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="email" className="mt-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium mb-1">Email Address</p>
                            <p className="text-sm text-muted-foreground">{userData.email || 'example@email.com'}</p>
                          </div>
                          <Button onClick={handleSendCode}>
                            Send Code
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          We'll send a verification code to this email address
                        </p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="phone" className="mt-4">
                      <Form {...phoneForm}>
                        <form className="space-y-4">
                          <FormField
                            control={phoneForm.control}
                            name="phoneNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number<span className="text-destructive ml-1">*</span></FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your phone number" {...field} />
                                </FormControl>
                                <FormDescription>
                                  We'll send a verification code to this number
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="button" onClick={handleSendCode} className="w-full">
                            Send Code
                          </Button>
                        </form>
                      </Form>
                    </TabsContent>
                  </Tabs>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="mb-2">Enter the 6-digit code sent to your {activeTab}</p>
                    <p className="text-sm text-muted-foreground mb-6">
                      {activeTab === 'email' 
                        ? userData.email || 'example@email.com'
                        : phoneForm.getValues().phoneNumber || '(555) 123-4567'}
                    </p>
                  </div>
                  
                  <div className="flex justify-center mb-6">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={setOtp}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  
                  <div className="space-y-2">
                    <Button onClick={handleVerifyCode} className="w-full">
                      Verify Code
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setOtpSent(false)} 
                      className="w-full"
                    >
                      Back
                    </Button>
                  </div>
                  
                  <p className="text-sm text-center text-muted-foreground">
                    Didn't receive the code?{' '}
                    <button 
                      onClick={handleSendCode}
                      className="text-primary hover:underline"
                    >
                      Resend
                    </button>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default TwoFactorAuth;

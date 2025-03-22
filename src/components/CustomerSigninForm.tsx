
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const customerFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type CustomerFormValues = z.infer<typeof customerFormSchema>;

const CustomerSigninForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: CustomerFormValues) => {
    console.log('Customer signin data:', data);
    
    // Simulate successful login
    toast({
      title: "Welcome back!",
      description: "You have successfully signed in.",
    });
    
    // Navigate to home page or dashboard
    navigate('/');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email<span className="text-destructive ml-1">*</span></FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password<span className="text-destructive ml-1">*</span></FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter your password" 
                    {...field} 
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
              <div className="text-sm text-right mt-1">
                <button 
                  type="button" 
                  className="text-primary hover:underline"
                  onClick={() => console.log('Forgot password')}
                >
                  Forgot password?
                </button>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Sign In
        </Button>
        
        <div className="text-center text-sm">
          Don't have an account?{" "}
          <button 
            type="button" 
            className="text-primary hover:underline"
            onClick={() => navigate('/signup')}
          >
            Sign up
          </button>
        </div>
      </form>
    </Form>
  );
};

export default CustomerSigninForm;


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
import { getUserNameFromEmail } from '@/utils/authUtils';

const mechanicFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type MechanicFormValues = z.infer<typeof mechanicFormSchema>;

const MechanicSigninForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  
  const form = useForm<MechanicFormValues>({
    resolver: zodResolver(mechanicFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: MechanicFormValues) => {
    console.log('Mechanic signin data:', data);
    
    // Store the email for profile sync
    localStorage.setItem('userEmail', data.email);
    
    // Get the stored name from localStorage - directly use the mechanic's email
    // to look up their stored name from registration
    const storedName = localStorage.getItem(`registered_${data.email}`);
    
    // If no stored name is found, use the email username as fallback
    const emailUsername = data.email.split('@')[0];
    const formattedUsername = emailUsername.charAt(0).toUpperCase() + emailUsername.slice(1);
    const userName = storedName || formattedUsername;
    
    // Store auth data in localStorage
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('userRole', 'mechanic');
    localStorage.setItem('userName', userName);
    const userId = Math.random().toString(36).substring(2, 9);
    localStorage.setItem('userId', userId);
    
    // Create user ID to email mapping
    localStorage.setItem(`userId_to_email_${userId}`, data.email);
    
    // Also update vendor name for consistency
    localStorage.setItem('vendorName', userName);
    
    // Dispatch storage event to notify all components
    window.dispatchEvent(new Event('storage-event'));
    
    // Get just the first name for the welcome message
    const firstName = userName.split(' ')[0];
    
    // Simulate successful login
    toast({
      title: `Welcome back, ${firstName}!`,
      description: "You have successfully signed in.",
    });
    
    // Navigate to mechanic dashboard with the correct route and replace option
    navigate('/mechanic-dashboard', { replace: true });
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

export default MechanicSigninForm;

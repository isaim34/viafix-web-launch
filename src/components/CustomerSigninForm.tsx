
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
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const customerFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type CustomerFormValues = z.infer<typeof customerFormSchema>;

const CustomerSigninForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = React.useState(false);
  
  const redirectTo = location.state?.redirectTo || '/';
  const redirectAction = location.state?.action || null;
  
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: CustomerFormValues) => {
    console.log('Customer signin data:', data);
    
    // Generate a consistent userId based on email
    const userId = `customer-${btoa(data.email).replace(/[=+/]/g, '').substring(0, 10)}`;
    localStorage.setItem('userId', userId);
    localStorage.setItem('userEmail', data.email);
    
    // Try to get the stored customer profile data first
    let userName = '';
    let profileData = null;
    
    try {
      // Look for previously saved profile data for this email
      const storedProfileData = localStorage.getItem(`customer_profile_${data.email}`);
      if (storedProfileData) {
        profileData = JSON.parse(storedProfileData);
        if (profileData.firstName) {
          // Use the stored name from profile
          userName = `${profileData.firstName} ${profileData.lastName || ''}`.trim();
        }
      }
    } catch (error) {
      console.error("Error parsing saved profile data:", error);
    }
    
    // If no profile data found, check for registered name
    if (!userName) {
      userName = localStorage.getItem(`registered_${data.email}`) || '';
    }
    
    // If still no name, use email as fallback
    if (!userName) {
      userName = data.email.split('@')[0].charAt(0).toUpperCase() + data.email.split('@')[0].slice(1);
    }
    
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('userRole', 'customer');
    localStorage.setItem('userName', userName);
    
    // Set up the customer profile
    if (!profileData) {
      profileData = {
        firstName: userName.split(' ')[0] || '',
        lastName: userName.split(' ').slice(1).join(' ') || '',
        profileImage: localStorage.getItem(`customer-${userId}-profileImage`) || ''
      };
    }
    
    localStorage.setItem('customerProfile', JSON.stringify(profileData));
    
    // Make sure email to userId mapping is stored
    localStorage.setItem(`userId_to_email_${userId}`, data.email);
    
    window.dispatchEvent(new Event('storage-event'));
    
    toast({
      title: `Welcome back, ${userName}!`,
      description: "You have successfully signed in.",
    });
    
    navigate(redirectTo);
    
    if (redirectAction) {
      setTimeout(() => {
        if (redirectAction === 'book') {
          toast({
            title: "You can now book services",
            description: "You've been signed in as a customer and can now book mechanic services.",
          });
        } else if (redirectAction === 'contact') {
          toast({
            title: "You can now chat with mechanics",
            description: "You've been signed in as a customer and can now chat with mechanics.",
          });
        }
      }, 500);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Email<span className="text-destructive ml-1">*</span></FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="pl-10" 
                    {...field} 
                  />
                </div>
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
              <FormLabel className="text-base">Password<span className="text-destructive ml-1">*</span></FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter your password" 
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
              <FormMessage />
              <div className="text-sm text-right mt-2">
                <button 
                  type="button" 
                  className="text-primary hover:underline font-medium"
                  onClick={() => console.log('Forgot password')}
                >
                  Forgot password?
                </button>
              </div>
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-[#6E59A5] hover:bg-[#7E69AB] text-white py-2 font-medium"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
        
        {redirectAction && (
          <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
            <p className="font-medium">Sign in required</p>
            <p>You need to sign in as a customer to {redirectAction === 'book' ? 'book services' : 'chat with mechanics'}.</p>
          </div>
        )}
        
        <div className="text-center text-sm pt-2">
          Don't have an account?{" "}
          <button 
            type="button" 
            className="text-[#6E59A5] hover:text-[#7E69AB] hover:underline font-medium transition-colors"
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

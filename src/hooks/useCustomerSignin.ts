
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from '@/hooks/use-toast';
import { generateUserId, setupCustomerProfile } from '@/utils/authUtils';

const customerFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;

export const useCustomerSignin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
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
    const userId = generateUserId(data.email);
    const { userName, profileData } = setupCustomerProfile(data.email, userId);
    
    // Store auth data
    localStorage.setItem('userId', userId);
    localStorage.setItem('userEmail', data.email);
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('userRole', 'customer');
    localStorage.setItem('userName', userName);
    localStorage.setItem('customerProfile', JSON.stringify(profileData));
    
    // Store email to userId mapping
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

  return {
    form,
    onSubmit,
    redirectAction,
  };
};

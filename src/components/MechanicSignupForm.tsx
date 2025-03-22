
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ZipCodeInput from './ZipCodeInput';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const mechanicFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  zipCode: z.string().regex(/^\d{5}$/, "Please enter a valid 5-digit zip code"),
  specialties: z.string().min(5, "Please list at least one specialty"),
  hourlyRate: z.string().regex(/^\d+$/, "Please enter a valid hourly rate"),
});

type MechanicFormValues = z.infer<typeof mechanicFormSchema>;

const MechanicSignupForm = () => {
  const navigate = useNavigate();
  
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
    },
  });

  const onSubmit = (data: MechanicFormValues) => {
    console.log('Mechanic signup data:', data);
    
    // Simulate API call for account creation
    toast({
      title: "Account created!",
      description: "Now let's set up two-factor authentication for your security.",
    });
    
    // Navigate to 2FA setup with user data
    navigate('/two-factor-auth', { 
      state: { 
        userData: data,
        userType: 'mechanic' 
      } 
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name<span className="text-destructive ml-1">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Enter your first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name<span className="text-destructive ml-1">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Enter your last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                <Input type="password" placeholder="Create a password" {...field} />
              </FormControl>
              <FormDescription>
                Must be at least 8 characters
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <ZipCodeInput 
          control={form.control}
          description="Enter your zip code to help customers find you"
        />

        <FormField
          control={form.control}
          name="specialties"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specialties<span className="text-destructive ml-1">*</span></FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="List your specialties (e.g. Engine Repair, Brake Service, Diagnostics)"
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hourlyRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hourly Rate ($)<span className="text-destructive ml-1">*</span></FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Enter your hourly rate" 
                  min="0" 
                  {...field} 
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Create Mechanic Account
        </Button>
      </form>
    </Form>
  );
};

export default MechanicSignupForm;

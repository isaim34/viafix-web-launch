
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const settingsSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
  zipCode: z.string().min(5, 'ZIP code must be at least 5 digits').optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

interface AccountSettingsFormProps {
  userRole: string | null;
}

const AccountSettingsForm = ({ userRole }: AccountSettingsFormProps) => {
  const { toast } = useToast();
  const auth = useAuth();
  const { userEmail } = auth;

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      email: userEmail || '',
      phone: '',
      zipCode: '',
    },
  });

  React.useEffect(() => {
    const loadProfile = async () => {
      try {
        // Get the current user session first
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData?.session?.user?.id) {
          // User has a Supabase session, fetch from profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('phone, zip_code')
            .eq('id', sessionData.session.user.id)
            .single();

          if (profile) {
            form.setValue('phone', profile.phone || '');
            form.setValue('zipCode', profile.zip_code || '');
          }
        } else {
          // User is using local auth, load from localStorage
          const userId = localStorage.getItem('userId');
          const storedPhone = localStorage.getItem('userPhone');
          const storedZipCode = localStorage.getItem('userZipCode');
          
          if (storedPhone) {
            form.setValue('phone', storedPhone);
          }
          if (storedZipCode) {
            form.setValue('zipCode', storedZipCode);
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadProfile();
  }, [form]);

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      // Check if user has a Supabase session
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData?.session?.user?.id) {
        // User has Supabase auth, update email and profile
        if (data.email !== userEmail) {
          const { error: updateError } = await supabase.auth.updateUser({
            email: data.email,
          });

          if (updateError) throw updateError;
        }

        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            phone: data.phone,
            zip_code: data.zipCode,
          })
          .eq('id', sessionData.session.user.id);

        if (profileError) throw profileError;
      } else {
        // User is using local auth, save to localStorage
        if (data.email !== userEmail) {
          localStorage.setItem('userEmail', data.email);
        }
        
        if (data.phone) {
          localStorage.setItem('userPhone', data.phone);
        }
        
        if (data.zipCode) {
          localStorage.setItem('userZipCode', data.zipCode);
        }
        
        // Trigger storage event to update other components
        window.dispatchEvent(new Event('storage-event'));
      }

      toast({
        title: "Settings updated",
        description: "Your account settings have been updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error updating settings",
        description: error.message || "Failed to update settings",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="Email" autoComplete="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input {...field} type="tel" placeholder="Phone number" autoComplete="tel" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ZIP Code</FormLabel>
              <FormControl>
                <Input {...field} placeholder="ZIP code" autoComplete="postal-code" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  );
};

export default AccountSettingsForm;

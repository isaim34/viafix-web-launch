
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Mail } from 'lucide-react';

const subscriptionSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

interface EmailSubscriptionFormProps {
  onSubscribe: (data: SubscriptionFormData) => Promise<void>;
}

const EmailSubscriptionForm = ({ onSubscribe }: EmailSubscriptionFormProps) => {
  const form = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      email: '',
    }
  });

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-6">
      <h3 className="flex items-center text-blue-800 text-sm font-medium mb-2">
        <Mail className="h-4 w-4 mr-2" />
        Enter Email for Free VIN Lookup
      </h3>
      <p className="text-blue-700 text-xs mb-4">
        No account required! Just enter your email to access vehicle safety information
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubscribe)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Enter your email" 
                      {...field} 
                      className="flex-1" 
                    />
                    <Button 
                      type="submit" 
                      variant="default"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing
                        </>
                      ) : (
                        'Get Access'
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default EmailSubscriptionForm;

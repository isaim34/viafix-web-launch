
import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

interface EmailFieldProps {
  form: UseFormReturn<any>;
}

const EmailField = ({ form }: EmailFieldProps) => {
  return (
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
  );
};

export default EmailField;

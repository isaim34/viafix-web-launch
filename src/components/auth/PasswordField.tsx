
import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';

interface PasswordFieldProps {
  form: UseFormReturn<any>;
  name?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

const PasswordField: React.FC<PasswordFieldProps> = ({ 
  form, 
  name = "password",
  label = "Password",
  placeholder = "Enter your password",
  required = true
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <Input 
              type="password" 
              placeholder={placeholder}
              autoComplete="current-password"
              {...field} 
            />
          </FormControl>
          <FormDescription className="text-xs text-gray-500">
            Avoid common passwords like "password123" or "qwerty". Try using a mix of letters, numbers, and symbols.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PasswordField;

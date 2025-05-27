
import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';

interface LoginCredentialsFieldsProps {
  control: Control<any>;
}

const LoginCredentialsFields: React.FC<LoginCredentialsFieldsProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email<span className="text-destructive ml-1">*</span></FormLabel>
          <FormControl>
            <Input 
              type="email" 
              placeholder="Enter your email" 
              autoComplete="email"
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LoginCredentialsFields;


import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import PasswordField from '@/components/auth/PasswordField';

interface LoginCredentialsFieldsProps {
  form: UseFormReturn<any>;
}

const LoginCredentialsFields: React.FC<LoginCredentialsFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
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
      
      <PasswordField 
        form={form} 
        name="password"
        label="Password"
        placeholder="Enter your password"
        required={true}
      />
    </>
  );
};

export default LoginCredentialsFields;

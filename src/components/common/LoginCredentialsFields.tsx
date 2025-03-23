
import React from 'react';
import {
  FormControl,
  FormDescription,
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
    <>
      <FormField
        control={control}
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
        control={control}
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
    </>
  );
};

export default LoginCredentialsFields;

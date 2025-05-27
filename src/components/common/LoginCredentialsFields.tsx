
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
import PasswordField from '@/components/auth/PasswordField';

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
        form={{ control }} 
        name="password"
        label="Password"
        placeholder="Enter your password"
        required={true}
      />
    </>
  );
};

export default LoginCredentialsFields;

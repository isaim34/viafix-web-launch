
import React, { useState } from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

interface PasswordFieldProps {
  form: UseFormReturn<any>;
}

const PasswordField = ({ form }: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base">Password<span className="text-destructive ml-1">*</span></FormLabel>
          <FormControl>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password" 
                className="pl-10" 
                {...field} 
              />
              <button 
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </FormControl>
          <FormMessage />
          <div className="text-sm text-right mt-2">
            <button 
              type="button" 
              className="text-primary hover:underline font-medium"
              onClick={() => console.log('Forgot password')}
            >
              Forgot password?
            </button>
          </div>
        </FormItem>
      )}
    />
  );
};

export default PasswordField;


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

interface PhoneFieldProps {
  control: Control<any>;
}

const PhoneField: React.FC<PhoneFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="phone"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Phone Number</FormLabel>
          <FormControl>
            <Input 
              {...field} 
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                field.onChange(value);
              }}
              maxLength={10}
            />
          </FormControl>
          <FormDescription>
            10-digit number (digits only)
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PhoneField;

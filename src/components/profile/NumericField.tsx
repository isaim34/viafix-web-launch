
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

interface NumericFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  description?: string;
}

const NumericField: React.FC<NumericFieldProps> = ({ 
  control, 
  name, 
  label, 
  description 
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input 
              type="number" 
              {...field} 
              onChange={(e) => {
                const value = e.target.value;
                field.onChange(value === '' ? '' : parseFloat(value));
              }}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default NumericField;

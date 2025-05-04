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

interface SpecialtiesFieldProps {
  control: Control<any>;
}

const SpecialtiesField: React.FC<SpecialtiesFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="specialties"
      render={({ field }) => {
        // Convert array to comma-separated string if it's an array
        const displayValue = Array.isArray(field.value) 
          ? field.value.join(', ') 
          : typeof field.value === 'string' ? field.value : '';
        
        // Create a handler that keeps the original field behavior but formats our value
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const inputValue = e.target.value;
          field.onChange(inputValue);
        };
        
        return (
          <FormItem>
            <FormLabel>Specialties</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                value={displayValue}
                onChange={handleChange}
              />
            </FormControl>
            <FormDescription>
              List your specialties separated by commas (e.g. "Brake Repair, Engine Diagnostics")
            </FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default SpecialtiesField;

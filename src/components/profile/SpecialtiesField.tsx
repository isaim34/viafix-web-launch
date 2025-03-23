
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
      render={({ field }) => (
        <FormItem>
          <FormLabel>Specialties</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormDescription>
            List your specialties separated by commas (e.g. "Brake Repair, Engine Diagnostics")
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SpecialtiesField;

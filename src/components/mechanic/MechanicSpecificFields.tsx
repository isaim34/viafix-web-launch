
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
import { Textarea } from '@/components/ui/textarea';
import { Control } from 'react-hook-form';
import { MechanicFormValues } from '@/schemas/signupSchema';

interface MechanicSpecificFieldsProps {
  control: Control<MechanicFormValues>;
}

const MechanicSpecificFields: React.FC<MechanicSpecificFieldsProps> = ({ control }) => {
  return (
    <>
      <FormField
        control={control}
        name="specialties"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Specialties<span className="text-destructive ml-1">*</span></FormLabel>
            <FormControl>
              <Textarea 
                placeholder="List your specialties (e.g. Engine Repair, Brake Service, Diagnostics)"
                className="resize-none" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="hourlyRate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hourly Rate ($)<span className="text-destructive ml-1">*</span></FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="Enter your hourly rate" 
                min="0" 
                {...field} 
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  field.onChange(value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default MechanicSpecificFields;

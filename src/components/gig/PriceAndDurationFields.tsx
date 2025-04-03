
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { GigFormValues } from './types';

interface PriceAndDurationFieldsProps {
  form: UseFormReturn<GigFormValues>;
}

const PriceAndDurationFields = ({ form }: PriceAndDurationFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price ($) <span className="text-destructive">*</span></FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="0" 
                {...field} 
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value === '' ? '' : parseFloat(value));
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Duration <span className="text-destructive">*</span></FormLabel>
            <FormControl>
              <Input placeholder="e.g. 1 hour, 30 minutes" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PriceAndDurationFields;

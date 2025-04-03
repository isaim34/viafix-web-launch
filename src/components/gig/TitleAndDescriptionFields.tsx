
import React from 'react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { GigFormValues } from './types';

interface TitleAndDescriptionFieldsProps {
  form: UseFormReturn<GigFormValues>;
}

const TitleAndDescriptionFields = ({ form }: TitleAndDescriptionFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Service Title <span className="text-destructive">*</span></FormLabel>
            <FormControl>
              <Input placeholder="e.g. Engine Diagnostic Service" {...field} />
            </FormControl>
            <FormDescription>
              Choose a clear, specific title for your service
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description <span className="text-destructive">*</span></FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe your service in detail..." 
                className="min-h-[100px]" 
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Explain what's included, your process, and what customers can expect
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default TitleAndDescriptionFields;

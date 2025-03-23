
import React from 'react';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Control } from 'react-hook-form';

interface AboutFieldProps {
  control: Control<any>;
}

const AboutField: React.FC<AboutFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="about"
      render={({ field }) => (
        <FormItem>
          <FormLabel>About</FormLabel>
          <FormControl>
            <Textarea 
              {...field} 
              className="min-h-[150px]"
            />
          </FormControl>
          <FormDescription>
            Tell customers about your experience, expertise and approach
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AboutField;

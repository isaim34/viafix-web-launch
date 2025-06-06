
import React from 'react';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Control } from 'react-hook-form';
import { Link } from 'react-router-dom';

interface TermsOfServiceCheckboxProps {
  control: Control<any>;
}

const TermsOfServiceCheckbox: React.FC<TermsOfServiceCheckboxProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="termsAccepted"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>
              I agree to the <Link to="/terms" className="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">Terms of Service</Link> and <Link to="/privacy" className="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">Privacy Policy</Link>
            </FormLabel>
            <FormDescription>
              You must agree to our terms and privacy policy to create an account
            </FormDescription>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default TermsOfServiceCheckbox;

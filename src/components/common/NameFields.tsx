
import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';

interface NameFieldsProps {
  control: Control<any>;
  firstNameLabel?: string;
  lastNameLabel?: string;
}

const NameFields: React.FC<NameFieldsProps> = ({ 
  control, 
  firstNameLabel = "First Name", 
  lastNameLabel = "Last Name" 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{firstNameLabel}<span className="text-destructive ml-1">*</span></FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter your first name" 
                autoComplete="given-name"
                {...field} 
                value={field.value || ''}
                onChange={(e) => {
                  // Ensure first name doesn't contain any spaces
                  const value = e.target.value.trim();
                  field.onChange(value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{lastNameLabel}<span className="text-destructive ml-1">*</span></FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter your last name" 
                autoComplete="family-name"
                {...field} 
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default NameFields;

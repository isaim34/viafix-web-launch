
import React from 'react';
import { Input } from '@/components/ui/input';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { MapPin } from 'lucide-react';
import { Control } from 'react-hook-form';

interface ZipCodeInputProps {
  control: Control<any>;
  name?: string;
  label?: string;
  description?: string;
  required?: boolean;
  onZipCodeChange?: (zipCode: string) => void;
}

const ZipCodeInput: React.FC<ZipCodeInputProps> = ({
  control,
  name = "zipCode",
  label = "Zip Code",
  description = "Enter your zip code to connect with nearby users",
  required = true,
  onZipCodeChange,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      rules={{
        required: required ? "Zip code is required" : false,
        pattern: {
          value: /^\d{5}$/,
          message: "Please enter a valid 5-digit zip code"
        }
      }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}{required && <span className="text-destructive ml-1">*</span>}</FormLabel>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <FormControl>
              <Input
                {...field}
                placeholder="Enter zip code"
                className="pl-10"
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                maxLength={5}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                  field.onChange(value);
                  if (onZipCodeChange) {
                    onZipCodeChange(value);
                  }
                }}
              />
            </FormControl>
          </div>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ZipCodeInput;

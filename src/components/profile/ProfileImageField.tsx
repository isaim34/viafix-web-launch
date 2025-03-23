
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

interface ProfileImageFieldProps {
  control: Control<any>;
}

const ProfileImageField: React.FC<ProfileImageFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="profileImage"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Profile Image URL</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormDescription>
            URL to your professional profile photo
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ProfileImageField;

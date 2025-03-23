
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ZipCodeInput from '@/components/ZipCodeInput';
import ProfilePictureUploader from '@/components/ProfilePictureUploader';
import { basicProfileSchema, BasicProfileFormValues, sampleMechanicProfile } from '@/schemas/profileSchema';
import NameFields from '@/components/common/NameFields';

interface BasicProfileFormProps {
  onSubmit?: (data: BasicProfileFormValues) => void;
}

const BasicProfileForm: React.FC<BasicProfileFormProps> = ({ onSubmit }) => {
  const form = useForm<BasicProfileFormValues>({
    resolver: zodResolver(basicProfileSchema),
    defaultValues: sampleMechanicProfile,
  });

  const handleSubmit = (data: BasicProfileFormValues) => {
    console.log('Updated profile data:', data);
    if (onSubmit) {
      onSubmit(data);
    }
  };

  const handleProfileImageChange = (url: string) => {
    form.setValue('profileImage', url);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="flex justify-center mb-8">
          <ProfilePictureUploader
            initialImageUrl={form.getValues('profileImage')}
            onImageChange={handleProfileImageChange}
          />
        </div>

        <NameFields control={form.control} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ZipCodeInput 
            control={form.control}
            description="This helps customers find you" 
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      field.onChange(value);
                    }}
                    maxLength={10}
                  />
                </FormControl>
                <FormDescription>
                  10-digit number (digits only)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="hourlyRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hourly Rate ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
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
            name="yearsExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years of Experience</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
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
        </div>

        <FormField
          control={form.control}
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

        <FormField
          control={form.control}
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

        <FormField
          control={form.control}
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

        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  );
};

export default BasicProfileForm;

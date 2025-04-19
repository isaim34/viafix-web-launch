
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import ZipCodeInput from '@/components/ZipCodeInput';
import ProfilePictureUploader from '@/components/ProfilePictureUploader';
import { basicProfileSchema, BasicProfileFormValues, sampleMechanicProfile } from '@/schemas/profileSchema';
import NameFields from '@/components/common/NameFields';
import PhoneField from './PhoneField';
import NumericField from './NumericField';
import SpecialtiesField from './SpecialtiesField';
import AboutField from './AboutField';

interface BasicProfileFormProps {
  onSubmit?: (data: BasicProfileFormValues) => void;
  initialData?: BasicProfileFormValues;
}

const BasicProfileForm: React.FC<BasicProfileFormProps> = ({ onSubmit, initialData }) => {
  const form = useForm<BasicProfileFormValues>({
    resolver: zodResolver(basicProfileSchema),
    defaultValues: initialData || sampleMechanicProfile,
    mode: 'onChange',
  });

  // Update form values when initialData changes
  useEffect(() => {
    if (initialData) {
      console.log('Setting form values from initialData:', initialData);
      
      // Reset form with new values
      form.reset(initialData);
      
      // Explicitly set each field to ensure proper update
      Object.entries(initialData).forEach(([key, value]) => {
        if (value !== undefined) {
          form.setValue(key as keyof BasicProfileFormValues, value, {
            shouldValidate: true,
            shouldDirty: false,
            shouldTouch: false
          });
        }
      });
    }
  }, [initialData, form]);

  const handleSubmit = (data: BasicProfileFormValues) => {
    console.log('Form submission triggered with data:', data);
    console.log('Profile image in submission:', data.profileImage?.substring(0, 50) + '...');
    
    // No conversion needed now that we've updated the schema
    // The form will accept either string or string[] for specialties
    
    if (onSubmit) {
      onSubmit(data);
    }
  };

  const handleProfileImageChange = (url: string) => {
    console.log('Profile image changed, length:', url.length);
    console.log('Profile image changed to (start):', url.substring(0, 50) + '...');
    
    // Set the value in the form
    form.setValue('profileImage', url, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
    
    // Force the form to recognize this as a change
    form.trigger('profileImage');
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
          
          <PhoneField control={form.control} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NumericField 
            control={form.control}
            name="hourlyRate"
            label="Hourly Rate ($)"
          />
          
          <NumericField 
            control={form.control}
            name="yearsExperience"
            label="Years of Experience"
          />
        </div>

        <SpecialtiesField control={form.control} />
        <AboutField control={form.control} />

        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  );
};

export default BasicProfileForm;

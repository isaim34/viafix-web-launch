
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
  // Ensure we have default values for firstName and lastName
  const defaultValues = {
    ...sampleMechanicProfile,
    ...(initialData || {}),
  };

  const form = useForm<BasicProfileFormValues>({
    resolver: zodResolver(basicProfileSchema),
    defaultValues: defaultValues,
    mode: 'onChange',
  });

  // Update form values when initialData changes
  useEffect(() => {
    if (initialData) {
      console.log('Setting form values from initialData:', initialData);
      
      // Reset the form with the new values
      form.reset({
        ...initialData,
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
      });
    }
  }, [initialData, form]);

  const handleSubmit = (data: BasicProfileFormValues) => {
    console.log('Form submission triggered with data:', data);
    console.log('Profile image in submission:', data.profileImage?.substring(0, 50) + '...');
    console.log('Form errors:', form.formState.errors);
    console.log('Form is valid:', form.formState.isValid);
    
    if (onSubmit) {
      console.log('Calling onSubmit function with data');
      onSubmit(data);
    } else {
      console.log('No onSubmit function provided');
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

  const handleButtonClick = (e: React.MouseEvent) => {
    console.log('Save Changes button clicked');
    console.log('Form state:', {
      isValid: form.formState.isValid,
      isDirty: form.formState.isDirty,
      isSubmitting: form.formState.isSubmitting,
      errors: form.formState.errors
    });
    
    // Don't prevent default here - let the form handle it
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

        <div className="flex justify-center">
          <Button 
            type="submit" 
            className="px-8"
            onClick={handleButtonClick}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BasicProfileForm;


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
  });

  // Update form values when initialData changes
  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        form.setValue(key as keyof BasicProfileFormValues, value);
      });
    }
  }, [initialData, form]);

  const handleSubmit = (data: BasicProfileFormValues) => {
    console.log('Updated profile data:', data);
    if (onSubmit) {
      onSubmit(data);
    }
  };

  const handleProfileImageChange = (url: string) => {
    form.setValue('profileImage', url, {
      shouldValidate: true,
      shouldDirty: true
    });
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

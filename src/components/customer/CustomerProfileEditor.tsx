
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomerProfileFormValues, customerProfileSchema } from '@/schemas/customerProfileSchema';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import NameFields from '@/components/common/NameFields';
import ProfilePictureUploader from '@/components/ProfilePictureUploader';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';

const CustomerProfileEditor = () => {
  const { toast } = useToast();
  const { currentUserName, currentUserId, updateUserName } = useCustomerAuth();
  const [isSaving, setIsSaving] = useState(false);
  
  // Parse first and last name from currentUserName
  const nameParts = currentUserName.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  
  // Get stored profile image from localStorage, if any
  const storedProfileImage = localStorage.getItem(`customer-${currentUserId}-profileImage`) || '';
  
  const form = useForm<CustomerProfileFormValues>({
    resolver: zodResolver(customerProfileSchema),
    defaultValues: {
      firstName,
      lastName,
      profileImage: storedProfileImage,
    },
  });

  const onSubmit = async (data: CustomerProfileFormValues) => {
    setIsSaving(true);
    
    try {
      console.log('Updated customer profile data:', data);
      
      // Store the updated profile in localStorage
      const formattedName = `${data.firstName} ${data.lastName}`;
      localStorage.setItem('userName', formattedName);
      localStorage.setItem(`customer-${currentUserId}-profileImage`, data.profileImage || '');
      
      // Update the user name in the auth context
      updateUserName(formattedName);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-center mb-8">
          <ProfilePictureUploader
            initialImageUrl={form.getValues('profileImage')}
            onImageChange={handleProfileImageChange}
          />
        </div>

        <NameFields control={form.control} />
        
        <div className="flex justify-center mt-8">
          <Button 
            type="submit" 
            disabled={isSaving || !form.formState.isDirty}
            className="px-8"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CustomerProfileEditor;

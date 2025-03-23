
import React from 'react';
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

  const onSubmit = (data: CustomerProfileFormValues) => {
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
  };

  const handleProfileImageChange = (url: string) => {
    form.setValue('profileImage', url);
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
        
        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  );
};

export default CustomerProfileEditor;

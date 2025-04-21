
import React, { useState, useEffect } from 'react';
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
  const userId = localStorage.getItem('userId') || currentUserId;
  const storedProfileImage = localStorage.getItem(`customer-${userId}-profileImage`) || '';
  
  const form = useForm<CustomerProfileFormValues>({
    resolver: zodResolver(customerProfileSchema),
    defaultValues: {
      firstName,
      lastName,
      profileImage: storedProfileImage,
    },
  });
  
  // Synchronize form with user data when currentUserName changes
  useEffect(() => {
    if (currentUserName) {
      const parts = currentUserName.split(' ');
      const first = parts[0] || '';
      const last = parts.slice(1).join(' ') || '';
      
      form.setValue('firstName', first);
      form.setValue('lastName', last);
    }
    
    // Re-fetch profile image when user ID changes
    const userId = localStorage.getItem('userId') || currentUserId;
    const profileImg = localStorage.getItem(`customer-${userId}-profileImage`);
    if (profileImg) {
      form.setValue('profileImage', profileImg);
    }
  }, [currentUserName, currentUserId, form]);

  const onSubmit = async (data: CustomerProfileFormValues) => {
    setIsSaving(true);
    
    try {
      console.log('Updated customer profile data:', data);
      
      // Store the updated profile in localStorage with consistent keys
      const formattedName = `${data.firstName} ${data.lastName}`;
      localStorage.setItem('userName', formattedName);
      
      // Use a consistent userId for storage
      const userId = localStorage.getItem('userId') || currentUserId;
      localStorage.setItem(`customer-${userId}-profileImage`, data.profileImage || '');
      
      // Also store in global avatar keys for compatibility
      localStorage.setItem('customerAvatar', data.profileImage || '');
      localStorage.setItem('customer-avatar', data.profileImage || '');
      
      // Ensure profile data is synced properly
      localStorage.setItem('customerProfile', JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        profileImage: data.profileImage
      }));
      
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
            disabled={isSaving}
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

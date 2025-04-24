
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
  
  // Parse first and last name from currentUserName with better handling
  const parseUserName = () => {
    if (!currentUserName) return { firstName: '', lastName: '' };
    
    // Handle combined names by attempting to split on spaces
    const nameParts = currentUserName.trim().split(' ');
    
    if (nameParts.length === 1) {
      // If there's only one part, treat it as first name
      return { firstName: nameParts[0], lastName: '' };
    } else {
      // First part is firstName, rest is lastName
      return { 
        firstName: nameParts[0], 
        lastName: nameParts.slice(1).join(' ') 
      };
    }
  };
  
  const { firstName, lastName } = parseUserName();
  
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
      const { firstName, lastName } = parseUserName();
      console.log('Setting name fields from currentUserName:', { firstName, lastName });
      
      form.setValue('firstName', firstName);
      form.setValue('lastName', lastName);
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
      
      // Ensure both names are properly trimmed
      const trimmedFirstName = data.firstName.trim();
      const trimmedLastName = data.lastName.trim();
      
      // Store the updated profile in localStorage with consistent keys
      const formattedName = `${trimmedFirstName} ${trimmedLastName}`.trim();
      if (formattedName) {
        localStorage.setItem('userName', formattedName);
        // Update the user name in the auth context
        updateUserName(formattedName);
      }
      
      // Use a consistent userId for storage
      const userId = localStorage.getItem('userId') || currentUserId;
      const userEmail = localStorage.getItem('userEmail');
      
      if (data.profileImage) {
        localStorage.setItem(`customer-${userId}-profileImage`, data.profileImage);
        
        // Also store in global avatar keys for compatibility
        localStorage.setItem('customerAvatar', data.profileImage);
        localStorage.setItem('customer-avatar', data.profileImage);
      }
      
      // Save to profile storage with trimmed values
      const profileData = {
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        profileImage: data.profileImage
      };
      
      // Ensure profile data is synced properly
      localStorage.setItem('customerProfile', JSON.stringify(profileData));
      
      // This is critical - store the profile by email to persist across sessions
      if (userEmail) {
        localStorage.setItem(`customer_profile_${userEmail}`, JSON.stringify(profileData));
        
        // Create a mapping from userId to email for future retrieval
        localStorage.setItem(`registered_${userEmail}`, formattedName);
        localStorage.setItem(`userId_to_email_${userId}`, userEmail);
      }
      
      // Trigger a storage event to update all components
      window.dispatchEvent(new Event('storage-event'));
      
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

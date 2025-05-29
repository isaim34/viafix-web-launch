
import React, { useEffect, useState } from 'react';
import ProfileTabs from './profile/ProfileTabs';
import { BasicProfileFormValues } from '@/schemas/profileSchema';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ProfileEditor = () => {
  const { toast } = useToast();
  const auth = useAuth();
  const { currentUserRole, updateUserName, currentUserName, user } = auth;
  const [profileData, setProfileData] = useState<BasicProfileFormValues | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const storageKey = currentUserRole === 'mechanic' ? 'mechanicProfile' : 'customerProfile';

  // Load profile data from localStorage on component mount
  useEffect(() => {
    setIsLoading(true);
    
    // Try to load saved profile data first
    const savedProfileData = localStorage.getItem(storageKey);
    if (savedProfileData) {
      try {
        const parsedData = JSON.parse(savedProfileData);
        console.log('Loading saved profile data:', parsedData);
        setProfileData(parsedData);
      } catch (error) {
        console.error('Error parsing profile data from localStorage:', error);
        setProfileData(createInitialProfile());
      }
    } else {
      setProfileData(createInitialProfile());
    }
    
    setIsLoading(false);
  }, [storageKey, currentUserName, currentUserRole]);
  
  // Helper function to create initial profile
  const createInitialProfile = () => {
    // Handle email-based usernames properly
    let firstName = '';
    let lastName = '';
    
    if (currentUserName) {
      if (currentUserName.includes('@')) {
        // If username is an email, use the part before @ as first name
        firstName = currentUserName.split('@')[0];
        // Capitalize first letter
        firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
      } else {
        // Normal name handling
        const nameParts = currentUserName.split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';
      }
    }
    
    const initialProfile = {
      firstName,
      lastName,
      phone: '',
      zipCode: '',
      about: '',
      specialties: '',
      yearsExperience: 0,
      hourlyRate: 0,
      profileImage: '',
    };
    
    console.log('Created new profile with current username:', initialProfile);
    return initialProfile;
  };
  
  const onSubmit = async (data: BasicProfileFormValues) => {
    console.log('🚀 PROFILE EDITOR SUBMIT START');
    console.log('📝 Form data received:', data);
    
    // Ensure we have the profile image in the data
    if (!data.profileImage && profileData?.profileImage) {
      data.profileImage = profileData.profileImage;
    }
    
    // Convert specialties to string format for consistency when saving
    if (Array.isArray(data.specialties)) {
      data.specialties = data.specialties.join(', ');
    }
    
    // Save to localStorage with user role-specific key
    localStorage.setItem(storageKey, JSON.stringify(data));
    console.log('💾 Profile data saved to localStorage with key:', storageKey);
    
    // Update username in localStorage if name has changed
    if (data.firstName !== undefined && data.lastName !== undefined) {
      const fullName = `${data.firstName} ${data.lastName}`.trim();
      
      if (fullName) {
        // Use the updateUserName function from useAuth to ensure proper updates
        updateUserName(fullName);
        console.log('👤 Updated userName in localStorage to:', fullName);
      }
    }

    // Save to Supabase database as well
    if (user?.id) {
      try {
        console.log('💾 Saving profile data to database for user:', user.id);
        
        // Update profiles table
        const profileUpdateData = {
          id: user.id,
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          zip_code: data.zipCode,
          profile_image: data.profileImage || null,
        };

        console.log('📋 Updating profiles table with:', profileUpdateData);

        const { error: profileError } = await supabase
          .from('profiles')
          .upsert(profileUpdateData, { onConflict: 'id' });

        if (profileError) {
          console.error('❌ Error updating profiles table:', profileError);
          throw profileError;
        } else {
          console.log('✅ Successfully updated profiles table');
        }

        // Update mechanic_profiles table if user is a mechanic
        if (currentUserRole === 'mechanic') {
          const mechanicUpdateData = {
            id: user.id,
            about: data.about,
            specialties: data.specialties,
            hourly_rate: data.hourlyRate,
            years_experience: data.yearsExperience,
          };

          console.log('🔧 Updating mechanic_profiles table with:', mechanicUpdateData);

          const { error: mechanicError } = await supabase
            .from('mechanic_profiles')
            .upsert(mechanicUpdateData, { onConflict: 'id' });

          if (mechanicError) {
            console.error('❌ Error updating mechanic_profiles table:', mechanicError);
            throw mechanicError;
          } else {
            console.log('✅ Successfully updated mechanic_profiles table');
          }
        }

        console.log('🎉 All database updates completed successfully');

        // Update state after saving
        setProfileData({...data});
        
        // Trigger window event to update progress tracker immediately
        console.log('📡 Dispatching profile-updated event');
        window.dispatchEvent(new CustomEvent('profile-updated'));
        
        // Also force a page refresh of the progress data after a short delay
        setTimeout(() => {
          console.log('🔄 Triggering additional profile update event');
          window.dispatchEvent(new CustomEvent('profile-updated'));
        }, 500);

        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated and saved",
        });

      } catch (error) {
        console.error('💥 Error saving to database:', error);
        toast({
          title: "Error saving profile",
          description: "There was an error saving your profile. Please try again.",
          variant: "destructive"
        });
        return; // Don't continue if database save failed
      }
    } else {
      console.log('⚠️ No user ID found, skipping database save');
      toast({
        title: "Profile updated locally",
        description: "Your profile has been saved locally",
      });
    }
    
    console.log('✅ PROFILE EDITOR SUBMIT COMPLETE');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {profileData ? (
        <ProfileTabs onProfileSubmit={onSubmit} initialProfileData={profileData} />
      ) : (
        <div className="p-6 bg-gray-100 rounded-md text-center">
          <p>Failed to load profile data. Please refresh the page and try again.</p>
        </div>
      )}
    </div>
  );
};

export default ProfileEditor;


import { BasicProfileFormValues } from '@/schemas/profileSchema';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AuthContextType } from '@/contexts/auth/types';

export const submitProfileData = async (
  data: BasicProfileFormValues,
  storageKey: string,
  auth: AuthContextType,
  profileData: BasicProfileFormValues | null,
  setProfileData: (data: BasicProfileFormValues) => void,
  toast: ReturnType<typeof useToast>['toast']
) => {
  console.log('🚀 PROFILE EDITOR SUBMIT START');
  console.log('📝 Form data received:', data);
  
  const { currentUserRole, updateUserName, user, isLoggedIn } = auth;
  
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

  // Only attempt Supabase save if user is properly authenticated
  if (user?.id && isLoggedIn) {
    try {
      console.log('💾 Saving profile data to database for user:', user.id);
      
      // Check current session to ensure we're authenticated
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        console.warn('⚠️ No valid session found, skipping database save');
        toast({
          title: "Profile saved locally",
          description: "Your profile changes have been saved locally. Please log in again to sync with the server.",
        });
        return;
      }
      
      // First, update or insert into profiles table
      const profileUpdateData = {
        id: user.id,
        first_name: data.firstName || null,
        last_name: data.lastName || null,
        phone: data.phone || null,
        zip_code: data.zipCode || null,
        profile_image: data.profileImage || null,
      };

      console.log('📋 Updating profiles table with:', profileUpdateData);

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileUpdateData, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        });

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
          about: data.about || null,
          specialties: data.specialties || null,
          hourly_rate: data.hourlyRate || 0,
          years_experience: data.yearsExperience || 0,
        };

        console.log('🔧 Updating mechanic_profiles table with:', mechanicUpdateData);

        const { error: mechanicError } = await supabase
          .from('mechanic_profiles')
          .upsert(mechanicUpdateData, { 
            onConflict: 'id',
            ignoreDuplicates: false 
          });

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
      
      // Provide more specific error messages based on the error
      let errorMessage = "There was an error saving your profile. Please try again.";
      
      if (error?.message?.includes('violates row-level security')) {
        errorMessage = "Authentication error. Please log out and log back in, then try again.";
      } else if (error?.message?.includes('new row violates')) {
        errorMessage = "Profile validation failed. Please check all required fields are filled correctly.";
      } else if (error?.message?.includes('network')) {
        errorMessage = "Network error. Please check your connection and try again.";
      }
      
      toast({
        title: "Error saving profile",
        description: errorMessage,
        variant: "destructive"
      });
      return; // Don't continue if database save failed
    }
  } else {
    console.log('⚠️ No authenticated user found, saving locally only');
    toast({
      title: "Profile saved locally",
      description: "Your profile has been saved locally. Please log in to sync with the server.",
    });
  }
  
  console.log('✅ PROFILE EDITOR SUBMIT COMPLETE');
};

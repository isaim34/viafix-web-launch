
export const syncCustomerProfileData = (userEmail?: string | null) => {
  try {
    const profileData = localStorage.getItem('customerProfile');
    const userName = localStorage.getItem('userName');
    const userId = localStorage.getItem('userId');
    
    // If we have email and profile update was made, prioritize the changes
    if (userEmail && profileData) {
      // Store the updated profile by email for persistence
      localStorage.setItem(`customer_profile_${userEmail}`, profileData);
      
      // Parse the current profile
      const profile = JSON.parse(profileData);
      
      // If this is a profile update, store the name mapping
      if (profile.firstName && profile.lastName) {
        const fullName = `${profile.firstName} ${profile.lastName}`.trim();
        if (fullName) {
          localStorage.setItem(`registered_${userEmail}`, fullName);
        }
      }
      
      // Handle customer avatar synchronization
      const avatarSources = [
        localStorage.getItem('customerAvatar'),
        localStorage.getItem('customer-avatar'),
        profile.profileImage
      ].filter(Boolean);
      
      if (avatarSources.length > 0) {
        const primaryAvatar = avatarSources[0];
        
        localStorage.setItem('customerAvatar', primaryAvatar);
        localStorage.setItem('customer-avatar', primaryAvatar);
        
        if (userId) {
          localStorage.setItem(`customer-${userId}-profileImage`, primaryAvatar);
        }
        
        if (profile.profileImage !== primaryAvatar) {
          profile.profileImage = primaryAvatar;
          localStorage.setItem('customerProfile', JSON.stringify(profile));
          localStorage.setItem(`customer_profile_${userEmail}`, JSON.stringify(profile));
        }
      }
    }
  } catch (error) {
    console.error('Error syncing customer profile data:', error);
  }
};

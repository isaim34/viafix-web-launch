
export const syncMechanicAvatar = (profile: any, userId?: string) => {
  try {
    const avatarSources = [
      localStorage.getItem('mechanicAvatar'),
      localStorage.getItem('mechanic-avatar'),
      profile.profileImage
    ].filter(Boolean);
    
    if (avatarSources.length > 0) {
      const primaryAvatar = avatarSources[0];
      
      // Set avatar in all storage locations
      localStorage.setItem('mechanicAvatar', primaryAvatar);
      localStorage.setItem('mechanic-avatar', primaryAvatar);
      localStorage.setItem('vendorAvatar', primaryAvatar);
      
      // Update profile image if it differs
      if (profile.profileImage !== primaryAvatar) {
        profile.profileImage = primaryAvatar;
        localStorage.setItem('mechanicProfile', JSON.stringify(profile));
      }
      
      // Store with user-specific key
      if (userId) {
        localStorage.setItem(`mechanic-${userId}-profileImage`, primaryAvatar);
      }
    }
  } catch (error) {
    console.error('Error syncing mechanic avatar:', error);
  }
};

export const syncMechanicName = (profile: any, userName: string | null, userEmail: string | null) => {
  try {
    if (userName) {
      localStorage.setItem('vendorName', userName);
      
      // Store the name with email for future retrieval
      if (userEmail) {
        localStorage.setItem(`registered_${userEmail}`, userName);
      }
    } else if (profile.firstName && profile.lastName) {
      const fullName = `${profile.firstName} ${profile.lastName}`.trim();
      localStorage.setItem('userName', fullName);
      localStorage.setItem('vendorName', fullName);
      
      if (userEmail) {
        localStorage.setItem(`registered_${userEmail}`, fullName);
      }
    }
  } catch (error) {
    console.error('Error syncing mechanic name:', error);
  }
};

export const syncMechanicProfileData = () => {
  try {
    const profileData = localStorage.getItem('mechanicProfile');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userId = localStorage.getItem('userId');
    
    if (profileData) {
      const profile = JSON.parse(profileData);
      
      // Sync avatar
      syncMechanicAvatar(profile, userId);
      
      // Sync name
      syncMechanicName(profile, userName, userEmail);
      
      // If userEmail exists, store profile by email
      if (userEmail) {
        localStorage.setItem(`mechanic_profile_${userEmail}`, JSON.stringify(profile));
      }
    }
  } catch (error) {
    console.error('Error syncing mechanic profile data:', error);
  }
};

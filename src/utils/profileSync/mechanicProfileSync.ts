
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
    // First, determine the best name to use
    let bestName = '';
    
    // Check if profile has name fields
    if (profile.firstName) {
      bestName = `${profile.firstName} ${profile.lastName || ''}`.trim();
    }
    
    // If userName is already set, use that if it's not an email
    if (userName && !userName.includes('@')) {
      bestName = bestName || userName;
    }
    
    // If userEmail exists and we have a registered name, use that
    if (userEmail) {
      const registeredName = localStorage.getItem(`registered_${userEmail}`);
      if (registeredName) {
        bestName = bestName || registeredName;
      }
    }
    
    // If we found a good name, sync it everywhere
    if (bestName) {
      // Always store as userName
      localStorage.setItem('userName', bestName);
      localStorage.setItem('vendorName', bestName);
      
      // Store the name with email mapping for future retrieval
      if (userEmail) {
        localStorage.setItem(`registered_${userEmail}`, bestName);
      }
      
      // Make sure profile has the correct names
      if (profile) {
        const nameParts = bestName.split(' ');
        if (nameParts.length > 0) {
          profile.firstName = nameParts[0];
          profile.lastName = nameParts.slice(1).join(' ');
          localStorage.setItem('mechanicProfile', JSON.stringify(profile));
        }
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
      
      // Update local mechanic data
      localStorage.setItem('mechanicProfile', JSON.stringify(profile));
    }
  } catch (error) {
    console.error('Error syncing mechanic profile data:', error);
  }
};

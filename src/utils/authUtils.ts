
export const generateUserId = (email: string): string => {
  return `customer-${btoa(email).replace(/[=+/]/g, '').substring(0, 10)}`;
};

export const getUserNameFromEmail = (email: string): string => {
  return email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
};

export const getStoredCustomerProfile = (email: string) => {
  try {
    // First try with the exact email
    let storedProfileData = localStorage.getItem(`customer_profile_${email}`);
    
    if (!storedProfileData) {
      // If not found with exact email, check if we have a mapping from email to userId
      const allKeys = Object.keys(localStorage);
      const userIdMappingKey = allKeys.find(key => key.startsWith(`userId_to_email_`) && 
        localStorage.getItem(key) === email);
      
      if (userIdMappingKey) {
        // Extract userId from the mapping key format "userId_to_email_[userId]"
        const userId = userIdMappingKey.replace('userId_to_email_', '');
        // Try to get profile by userId
        storedProfileData = localStorage.getItem(`customer-${userId}-profile`);
      }
    }
    
    if (storedProfileData) {
      return JSON.parse(storedProfileData);
    }
  } catch (error) {
    console.error("Error parsing saved profile data:", error);
  }
  return null;
};

export const setupCustomerProfile = (email: string, userId: string) => {
  // Try to get the stored customer profile data first
  let userName = '';
  let profileData = getStoredCustomerProfile(email);
  
  if (profileData?.firstName) {
    // Use the stored name from profile
    userName = `${profileData.firstName} ${profileData.lastName || ''}`.trim();
  } else {
    // Check for registered name
    userName = localStorage.getItem(`registered_${email}`) || '';
  }
  
  // If no name found, use email as fallback
  if (!userName) {
    userName = getUserNameFromEmail(email);
  }
  
  // Set up the customer profile
  if (!profileData) {
    profileData = {
      firstName: userName.split(' ')[0] || '',
      lastName: userName.split(' ').slice(1).join(' ') || '',
      profileImage: localStorage.getItem(`customer-${userId}-profileImage`) || ''
    };
  }
  
  // Always create the userId to email mapping to improve retrieval
  localStorage.setItem(`userId_to_email_${userId}`, email);
  
  return { userName, profileData };
};

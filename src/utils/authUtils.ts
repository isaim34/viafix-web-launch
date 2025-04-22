
export const generateUserId = (email: string): string => {
  return `customer-${btoa(email).replace(/[=+/]/g, '').substring(0, 10)}`;
};

export const getUserNameFromEmail = (email: string): string => {
  return email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
};

export const getStoredCustomerProfile = (email: string) => {
  try {
    const storedProfileData = localStorage.getItem(`customer_profile_${email}`);
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
  
  return { userName, profileData };
};


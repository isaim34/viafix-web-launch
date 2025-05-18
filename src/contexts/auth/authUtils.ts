export const generateUserId = (email: string): string => {
  return `customer-${btoa(email).replace(/[=+/]/g, '').substring(0, 10)}`;
};

/**
 * Generates a user name from an email address
 * If the email is in the format firstname.lastname@domain.com, it will return "Firstname Lastname"
 * Otherwise, it will return the part before the @ symbol
 * 
 * @param email - The user's email address
 * @returns A formatted user name based on the email
 */
export const getUserNameFromEmail = (email: string): string => {
  if (!email) return 'User';
  
  try {
    // Get the part before the @ symbol
    const localPart = email.split('@')[0];
    
    if (localPart.includes('.')) {
      // If there's a dot, assume it's firstname.lastname format
      return localPart
        .split('.')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
    } else if (localPart.includes('_')) {
      // If there's an underscore, assume it's firstname_lastname format
      return localPart
        .split('_')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
    } else {
      // Otherwise just capitalize the local part
      return localPart.charAt(0).toUpperCase() + localPart.slice(1);
    }
  } catch (error) {
    console.error("Error generating username from email:", error);
    return 'User';
  }
};

/**
 * Extracts the first name from a full name
 * 
 * @param fullName - The user's full name
 * @returns The first name, or the full name if no space is found
 */
export const getFirstName = (fullName: string): string => {
  if (!fullName) return '';
  return fullName.split(' ')[0];
};

/**
 * Validates if a provided string is a valid email address
 * 
 * @param email - The string to validate as an email address
 * @returns Boolean indicating if the string is a valid email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
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

// Add a function to clear local auth state
export const clearLocalAuthState = () => {
  // Auth-related items
  localStorage.removeItem('userLoggedIn');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userName');
  localStorage.removeItem('userId');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('selectedRole');
  localStorage.removeItem('pendingAuthRole');
  localStorage.removeItem('vendorName');
  
  // Remove any profiles
  localStorage.removeItem('customerProfile');
  localStorage.removeItem('mechanicProfile');
  
  // Clear any other auth-related items
  const allKeys = Object.keys(localStorage);
  const authKeys = allKeys.filter(key => 
    key.startsWith('customer-') || 
    key.startsWith('userId_to_email_') ||
    key.startsWith('registered_')
  );
  
  authKeys.forEach(key => localStorage.removeItem(key));
  
  console.log('All local auth state cleared');
};

// Add a function to persist user info to localStorage
export const persistUserToLocalStorage = (user: {
  id: string;
  email: string | undefined;
  role: string;
  name: string;
}) => {
  localStorage.setItem('userLoggedIn', 'true');
  localStorage.setItem('userId', user.id);
  if (user.email) localStorage.setItem('userEmail', user.email);
  localStorage.setItem('userRole', user.role);
  localStorage.setItem('userName', user.name);
  
  console.log(`User data persisted to localStorage: ${user.name} (${user.role})`);
};

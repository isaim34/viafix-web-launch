import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

type AuthContextType = {
  isLoggedIn: boolean;
  currentUserName: string;
  currentUserRole: string | null;
  userEmail: string | null;
  updateUserName: (newName: string) => void;
  getFirstName: (fullName: string) => string;
  signOut: () => Promise<void>;
  authChecked: boolean;
  isMechanicLoggedIn: boolean;
  isCustomerLoggedIn: boolean;
};

const defaultContext: AuthContextType = {
  isLoggedIn: false,
  currentUserName: '',
  currentUserRole: null,
  userEmail: null,
  updateUserName: () => {},
  getFirstName: () => '',
  signOut: async () => {},
  authChecked: false,
  isMechanicLoggedIn: false,
  isCustomerLoggedIn: false,
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

export const useAuth = () => useContext(AuthContext);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);
  const [isMechanicLoggedIn, setIsMechanicLoggedIn] = useState(false);
  const [currentUserName, setCurrentUserName] = useState('');
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  
  // Get first name from full name or email
  const getFirstName = (fullName: string) => {
    if (!fullName) return '';
    
    // Handle email addresses - extract username portion before @ symbol
    if (fullName.includes('@')) {
      const username = fullName.split('@')[0];
      // Capitalize first letter for better display
      return username.charAt(0).toUpperCase() + username.slice(1);
    }
    
    // Regular name - take first part
    const parts = fullName.trim().split(' ');
    return parts[0] || '';
  };

  // Update user's display name
  const updateUserName = (newName: string) => {
    if (!newName) return;
    
    const trimmedName = newName.trim();
    if (trimmedName.length === 0) return;
    
    // Store the full name in localStorage
    localStorage.setItem('userName', trimmedName);
    setCurrentUserName(trimmedName);
    
    // If we have an email, update the registered name mapping
    const email = localStorage.getItem('userEmail');
    if (email) {
      localStorage.setItem(`registered_${email}`, trimmedName);
      
      // Try to update user profiles
      try {
        const profileData = localStorage.getItem(`customer_profile_${email}`);
        if (profileData) {
          const profile = JSON.parse(profileData);
          const nameParts = trimmedName.split(' ');
          
          if (nameParts.length >= 1) {
            profile.firstName = nameParts[0] || '';
            profile.lastName = nameParts.slice(1).join(' ') || '';
          }
          
          localStorage.setItem(`customer_profile_${email}`, JSON.stringify(profile));
          localStorage.setItem('customerProfile', JSON.stringify(profile));
        }
        
        // For mechanics
        if (localStorage.getItem('userRole') === 'mechanic') {
          const mechanicProfileData = localStorage.getItem('mechanicProfile');
          if (mechanicProfileData) {
            const mechanicProfile = JSON.parse(mechanicProfileData);
            const nameParts = trimmedName.split(' ');
            
            if (nameParts.length >= 1) {
              mechanicProfile.firstName = nameParts[0] || '';
              mechanicProfile.lastName = nameParts.slice(1).join(' ') || '';
            }
            
            localStorage.setItem('mechanicProfile', JSON.stringify(mechanicProfile));
            localStorage.setItem('vendorName', trimmedName);
          }
        }
      } catch (e) {
        console.error('Error updating profile with new name:', e);
      }
    }
    
    // Dispatch storage event for cross-component updates
    window.dispatchEvent(new Event('storage-event'));
  };

  // Sign out the user
  const signOut = async () => {
    try {
      // Clear auth storage
      localStorage.removeItem('userLoggedIn');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userId');
      
      // Additional cleanup for subscriptions
      localStorage.removeItem('subscription_status');
      localStorage.removeItem('subscription_plan');
      localStorage.removeItem('subscription_end');
      
      // Attempt to sign out from Supabase if available
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error('Supabase sign out error:', e);
      }
      
      // Update auth state
      setIsCustomerLoggedIn(false);
      setIsMechanicLoggedIn(false);
      setCurrentUserName('');
      setCurrentUserRole(null);
      setUserEmail(null);
      
      // Trigger auth state updates
      window.dispatchEvent(new Event('storage-event'));
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  // Check auth status on component mount and listen for changes
  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        // First check if we have an active session in Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log("Active Supabase session found:", session.user.email);
          // We have a valid session, use this as source of truth
          
          const email = session.user.email || '';
          const userType = session.user.user_metadata?.user_type || 'customer';
          const userName = session.user.user_metadata?.full_name || 
                          email.split('@')[0] || 'User';
          
          // Update localStorage with the session data to keep everything in sync
          localStorage.setItem('userLoggedIn', 'true');
          localStorage.setItem('userRole', userType);
          localStorage.setItem('userName', userName);
          localStorage.setItem('userEmail', email);
          localStorage.setItem('userId', session.user.id);
          
          // Update state with session data
          setIsCustomerLoggedIn(userType === 'customer');
          setIsMechanicLoggedIn(userType === 'mechanic');
          setCurrentUserName(userName);
          setCurrentUserRole(userType);
          setUserEmail(email);
        } else {
          // No Supabase session, fall back to localStorage
          const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
          const userRole = localStorage.getItem('userRole');
          const userName = localStorage.getItem('userName');
          const email = localStorage.getItem('userEmail');
          
          // For mechanics, we need to be even more aggressive about finding a proper name
          let storedName = userName || '';
          
          if ((storedName.includes('@') || !storedName) && email) {
            // Try to get a registered name for this email
            let registeredName = localStorage.getItem(`registered_${email}`);
            
            // If we're a mechanic, also check the mechanicProfile
            if (userRole === 'mechanic' && !registeredName) {
              try {
                const mechanicProfile = localStorage.getItem('mechanicProfile');
                if (mechanicProfile) {
                  const profile = JSON.parse(mechanicProfile);
                  if (profile.firstName) {
                    registeredName = `${profile.firstName} ${profile.lastName || ''}`.trim();
                  }
                }
              } catch (e) {
                console.error('Error checking mechanic profile for name:', e);
              }
            }
            
            if (registeredName) {
              storedName = registeredName;
              // Update localStorage immediately to fix the display for future renders
              localStorage.setItem('userName', registeredName);
            }
          }
          
          setIsCustomerLoggedIn(userLoggedIn && userRole === 'customer');
          setIsMechanicLoggedIn(userLoggedIn && userRole === 'mechanic');
          setCurrentUserName(storedName);
          setCurrentUserRole(userRole);
          setUserEmail(email);
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
      } finally {
        setAuthChecked(true);
      }
    };
    
    // Initial auth check
    checkUserAuth();
    
    // Set up listener for auth state changes from Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        // Use setTimeout to prevent potential auth deadlocks
        setTimeout(() => checkUserAuth(), 0);
      }
    );
    
    // Listen for storage events for cross-tab sync and custom storage events
    window.addEventListener('storage', checkUserAuth);
    window.addEventListener('storage-event', checkUserAuth);
    
    return () => {
      subscription?.unsubscribe();
      window.removeEventListener('storage', checkUserAuth);
      window.removeEventListener('storage-event', checkUserAuth);
    };
  }, []);

  const value = {
    isLoggedIn: isCustomerLoggedIn || isMechanicLoggedIn,
    isMechanicLoggedIn,
    isCustomerLoggedIn,
    currentUserName,
    currentUserRole,
    userEmail,
    updateUserName,
    getFirstName,
    signOut,
    authChecked,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

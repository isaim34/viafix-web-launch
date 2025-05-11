
import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { AuthContextType } from './types';
import { getFirstName, clearLocalAuthState, persistUserToLocalStorage } from './authUtils';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => false,
  isLoggedIn: false,
  authChecked: false,
  updateUserName: () => {},
  getFirstName: () => '',
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string | undefined>(undefined);
  const [currentUserName, setCurrentUserName] = useState<string | undefined>(undefined);
  const [localAuthState, setLocalAuthState] = useState<{isLoggedIn: boolean}>({ isLoggedIn: false });

  // Clear local auth state
  const clearAuthState = () => {
    console.log("Clearing auth state");
    setUser(null);
    setSession(null);
    setCurrentUserRole(undefined);
    setCurrentUserName(undefined);
    setLocalAuthState({ isLoggedIn: false });
    
    // Clear any auth-related localStorage items for consistency
    clearLocalAuthState();
  };

  useEffect(() => {
    console.log("AuthProvider: Setting up auth state listeners");
    
    try {
      // Setup auth state listener (prioritized)
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          console.log("Auth state changed:", event, !!newSession?.user);
          
          if (event === 'SIGNED_OUT') {
            clearAuthState();
            setAuthChecked(true);
            setLoading(false);
          } else if (newSession?.user) {
            setSession(newSession);
            setUser(newSession.user);
            setLocalAuthState({ isLoggedIn: true });
            
            const role = newSession.user.user_metadata?.role || 
                        newSession.user.user_metadata?.user_type || 'customer';
            const name = newSession.user.user_metadata?.full_name || 
                        newSession.user.user_metadata?.name ||
                        newSession.user.email;
            
            setCurrentUserRole(role);
            setCurrentUserName(name);
            
            // Update localStorage for consistency
            persistUserToLocalStorage({
              id: newSession.user.id,
              email: newSession.user.email,
              role: role,
              name: name
            });
            
            setAuthChecked(true);
            setLoading(false);
          }
        }
      );

      // Initial auth state check
      const checkAuthState = async () => {
        try {
          // First check supabase session
          const { data: { session: existingSession }, error } = await supabase.auth.getSession();
          
          console.log("Initial session check:", !!existingSession?.user, error);
          
          if (existingSession?.user) {
            // Supabase session exists - use it as source of truth
            setSession(existingSession);
            setUser(existingSession.user);
            setLocalAuthState({ isLoggedIn: true });
            
            const role = existingSession.user.user_metadata?.role || 
                        existingSession.user.user_metadata?.user_type || 'customer';
            const name = existingSession.user.user_metadata?.full_name || 
                        existingSession.user.user_metadata?.name ||
                        existingSession.user.email;
            
            setCurrentUserRole(role);
            setCurrentUserName(name);
            
            // Update localStorage for consistency
            persistUserToLocalStorage({
              id: existingSession.user.id,
              email: existingSession.user.email,
              role: role,
              name: name
            });
          } else {
            // Check localStorage as fallback
            const isUserLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
            const userRole = localStorage.getItem('userRole');
            const userName = localStorage.getItem('userName');
            const userId = localStorage.getItem('userId');
            const userEmail = localStorage.getItem('userEmail');
            
            if (isUserLoggedIn && userRole && userId) {
              console.log("Found login state in localStorage:", { isUserLoggedIn, userRole, userName, userId });
              setLocalAuthState({ isLoggedIn: true });
              setCurrentUserRole(userRole);
              setCurrentUserName(userName);
              
              // Attempt to refresh session from localStorage data
              try {
                const { data, error } = await supabase.auth.getUser();
                if (data?.user && !error) {
                  setUser(data.user);
                  // Get a fresh session
                  const sessionResult = await supabase.auth.getSession();
                  if (sessionResult.data.session) {
                    setSession(sessionResult.data.session);
                  }
                }
              } catch (refreshError) {
                console.error("Error refreshing user session:", refreshError);
              }
            } else {
              // No valid auth anywhere - ensure clean state
              clearAuthState();
            }
          }
        } catch (err) {
          console.error("Error during auth check:", err);
          clearAuthState();
        } finally {
          setAuthChecked(true);
          setLoading(false);
        }
      };
      
      // Run initial auth check
      checkAuthState();

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error("Error in auth setup:", error);
      setAuthChecked(true);
      setLoading(false);
      return () => {};
    }
  }, []);

  // Add a window event listener to detect storage changes
  useEffect(() => {
    try {
      const handleStorageChange = () => {
        const isUserLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        const userRole = localStorage.getItem('userRole');
        const userName = localStorage.getItem('userName');
        const userId = localStorage.getItem('userId');
        
        console.log("Storage changed event:", { isUserLoggedIn, userRole, userName, userId });
        
        if (!isUserLoggedIn || !userId) {
          clearAuthState();
        } else if (isUserLoggedIn && userRole && userId) {
          setLocalAuthState({ isLoggedIn: true });
          setCurrentUserRole(userRole); 
          setCurrentUserName(userName);
        }
      };
      
      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('storage-event', handleStorageChange);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('storage-event', handleStorageChange);
      };
    } catch (error) {
      console.error("Error setting up storage listeners:", error);
      return () => {};
    }
  }, []);

  // The main isLoggedIn state combines Supabase auth and localStorage
  const isLoggedIn = !!user || localAuthState.isLoggedIn;

  // Console log for debugging
  useEffect(() => {
    console.log("AuthContext updated state:", {
      isLoggedIn,
      authChecked,
      currentUserRole,
      currentUserName,
      user: !!user,
      session: !!session,
      localAuthState
    });
  }, [isLoggedIn, authChecked, currentUserRole, currentUserName, user, session, localAuthState]);

  // Skip authentication methods for quick sign in
  const signIn = async (email: string, password: string) => {
    console.log("Skipping actual sign in for quick testing mode");
    return { user: null, session: null };
  };

  const signUp = async (email: string, password: string, userData: any) => {
    console.log("Skipping actual sign up for quick testing mode");
    return { user: null, session: null };
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear auth state on successful sign out
      clearAuthState();
      
      // Trigger event for other components
      window.dispatchEvent(new Event('storage-event'));
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    console.log("Password reset not needed in testing mode");
    return true;
  };

  const updateUserName = (name: string) => {
    setCurrentUserName(name);
    localStorage.setItem('userName', name);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signIn, 
      signUp, 
      signOut,
      resetPassword,
      currentUserRole,
      currentUserName,
      isLoggedIn,
      authChecked,
      updateUserName,
      userEmail: user?.email || localStorage.getItem('userEmail'),
      getFirstName
    }}>
      {children}
    </AuthContext.Provider>
  );
};

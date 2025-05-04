
import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { AuthContextType } from './types';
import { getFirstName, clearLocalAuthState } from './authUtils';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
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
          
          const role = newSession.user.user_metadata?.role || 'customer';
          const name = newSession.user.user_metadata?.full_name || newSession.user.email;
          
          setCurrentUserRole(role);
          setCurrentUserName(name);
          
          // Update localStorage for consistency
          localStorage.setItem('userLoggedIn', 'true');
          localStorage.setItem('userRole', role);
          if (name) localStorage.setItem('userName', name);
          
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
          
          const role = existingSession.user.user_metadata?.role || 'customer';
          const name = existingSession.user.user_metadata?.full_name || existingSession.user.email;
          
          setCurrentUserRole(role);
          setCurrentUserName(name);
          
          // Update localStorage for consistency
          localStorage.setItem('userLoggedIn', 'true');
          localStorage.setItem('userRole', role);
          if (name) localStorage.setItem('userName', name);
        } else {
          // Check localStorage as fallback
          const isUserLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
          const userRole = localStorage.getItem('userRole');
          const userName = localStorage.getItem('userName');
          
          if (isUserLoggedIn && userRole) {
            console.log("Found login state in localStorage:", { isUserLoggedIn, userRole, userName });
            setLocalAuthState({ isLoggedIn: true });
            setCurrentUserRole(userRole);
            setCurrentUserName(userName);
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
  }, []);

  // Add a window event listener to detect storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const isUserLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
      const userRole = localStorage.getItem('userRole');
      const userName = localStorage.getItem('userName');
      
      console.log("Storage changed event:", { isUserLoggedIn, userRole, userName });
      
      if (!isUserLoggedIn) {
        clearAuthState();
      } else if (isUserLoggedIn && userRole) {
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
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, userData: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    if (error) throw error;
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

  const updateUserName = (name: string) => {
    setCurrentUserName(name);
  };

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

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signIn, 
      signUp, 
      signOut,
      currentUserRole,
      currentUserName,
      isLoggedIn,
      authChecked,
      updateUserName,
      userEmail: user?.email,
      getFirstName
    }}>
      {children}
    </AuthContext.Provider>
  );
};

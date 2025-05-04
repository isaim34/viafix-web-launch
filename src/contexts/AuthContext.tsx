
import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  currentUserRole?: string;
  currentUserName?: string;
  isLoggedIn: boolean;
  authChecked: boolean;
  updateUserName: (name: string) => void;
  userEmail?: string;
  getFirstName: (fullName: string) => string;
}

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
    
    // Also clear any auth-related localStorage items for consistency
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
  };

  useEffect(() => {
    console.log("AuthProvider: Setting up auth state listeners");
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed:", event, !!newSession);
        
        // Handle signout event specifically
        if (event === 'SIGNED_OUT') {
          clearAuthState();
        } else if (newSession?.user) {
          setSession(newSession);
          setUser(newSession.user);
          setLocalAuthState({ isLoggedIn: true });
          
          // Get user metadata if available
          const role = newSession.user.user_metadata?.role || 'customer';
          const name = newSession.user.user_metadata?.full_name || newSession.user.email;
          
          setCurrentUserRole(role);
          setCurrentUserName(name);
        }
        
        setLoading(false);
        setAuthChecked(true);
      }
    );

    // Check for existing session and local storage state
    const checkAuthState = async () => {
      // First check supabase session
      const { data: { session: existingSession }, error } = await supabase.auth.getSession();
      
      console.log("Initial session check:", !!existingSession, error);
      
      if (error) {
        console.error("Error checking session:", error);
        clearAuthState();
      } else if (existingSession?.user) {
        setSession(existingSession);
        setUser(existingSession.user);
        setLocalAuthState({ isLoggedIn: true });
        
        // Get user metadata if available
        const role = existingSession.user.user_metadata?.role || 'customer';
        const name = existingSession.user.user_metadata?.full_name || existingSession.user.email;
        
        setCurrentUserRole(role);
        setCurrentUserName(name);
      } else {
        // No Supabase session, check localStorage as fallback
        const isUserLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        const userRole = localStorage.getItem('userRole');
        const userName = localStorage.getItem('userName');
        
        if (isUserLoggedIn && userRole) {
          console.log("Found login state in localStorage:", { isUserLoggedIn, userRole, userName });
          setLocalAuthState({ isLoggedIn: true });
          setCurrentUserRole(userRole);
          setCurrentUserName(userName);
        } else {
          // No valid session anywhere
          clearAuthState();
        }
      }
      
      setAuthChecked(true);
      setLoading(false);
    };
    
    checkAuthState();

    return () => subscription.unsubscribe();
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
      
      // Dispatch event to notify components about auth state change
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

  // Helper to get first name from email or regular name
  const getFirstName = (fullName: string) => {
    if (!fullName) return '';
    
    // Handle email addresses - extract username portion before @ symbol
    if (fullName.includes('@')) {
      const username = fullName.split('@')[0];
      // Capitalize first letter for better display
      return username.charAt(0).toUpperCase() + username.slice(1);
    }
    
    // Regular name - just take first part
    const parts = fullName.trim().split(' ');
    return parts[0] || '';
  };

  // The main isLoggedIn state combines Supabase auth and localStorage
  const isLoggedIn = !!user || localAuthState.isLoggedIn;

  // Console log for debugging
  useEffect(() => {
    console.log("AuthContext state:", {
      isLoggedIn,
      authChecked,
      currentUserRole,
      currentUserName
    });
  }, [isLoggedIn, authChecked, currentUserRole, currentUserName]);

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

export const useAuth = () => {
  return React.useContext(AuthContext);
};

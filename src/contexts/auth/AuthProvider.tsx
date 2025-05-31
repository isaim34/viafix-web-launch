
import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { AuthContextType } from './types';
import { getFirstName } from './authUtils';

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

  useEffect(() => {
    console.log("AuthProvider: Setting up Supabase auth state listeners");
    
    // Setup auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event, !!newSession?.user);
        
        if (event === 'SIGNED_OUT' || !newSession) {
          setUser(null);
          setSession(null);
          setCurrentUserRole(undefined);
          setCurrentUserName(undefined);
          setAuthChecked(true);
          setLoading(false);
        } else if (newSession?.user) {
          setSession(newSession);
          setUser(newSession.user);
          
          // Get role and name from user metadata
          const role = newSession.user.user_metadata?.user_type || 'customer';
          const firstName = newSession.user.user_metadata?.first_name;
          const lastName = newSession.user.user_metadata?.last_name;
          const name = firstName && lastName ? `${firstName} ${lastName}` : 
                     newSession.user.user_metadata?.full_name || 
                     newSession.user.email?.split('@')[0] || 'User';
          
          setCurrentUserRole(role);
          setCurrentUserName(name);
          setAuthChecked(true);
          setLoading(false);
          
          // For signup events, don't automatically navigate
          // Let the user stay on the current page or use explicit navigation
          if (event === 'SIGNED_UP') {
            console.log('User signed up successfully, staying on current page for email verification');
          }
        }
      }
    );

    // Initial auth state check
    const checkInitialAuth = async () => {
      try {
        const { data: { session: existingSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
        }
        
        if (existingSession?.user) {
          setSession(existingSession);
          setUser(existingSession.user);
          
          const role = existingSession.user.user_metadata?.user_type || 'customer';
          const firstName = existingSession.user.user_metadata?.first_name;
          const lastName = existingSession.user.user_metadata?.last_name;
          const name = firstName && lastName ? `${firstName} ${lastName}` : 
                     existingSession.user.user_metadata?.full_name || 
                     existingSession.user.email?.split('@')[0] || 'User';
          
          setCurrentUserRole(role);
          setCurrentUserName(name);
        }
      } catch (err) {
        console.error("Error during initial auth check:", err);
      } finally {
        setAuthChecked(true);
        setLoading(false);
      }
    };
    
    checkInitialAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const isLoggedIn = !!user && !!session;

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Reset password error:", error);
      return false;
    }
  };

  const updateUserName = (name: string) => {
    setCurrentUserName(name);
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
      userEmail: user?.email,
      getFirstName
    }}>
      {children}
    </AuthContext.Provider>
  );
};


import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useAdvertisingAccess = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  
  const { isLoggedIn, authChecked, currentUserRole } = useAuth();

  useEffect(() => {
    const checkAccess = async () => {
      setIsLoading(true);
      setError(null);
      
      // Wait for auth to be checked
      if (!authChecked) {
        return;
      }
      
      // Check if user is logged in
      if (!isLoggedIn) {
        setError("You must be logged in to access advertising options");
        setHasAccess(false);
        setIsLoading(false);
        return;
      }
      
      // Check role from context or localStorage
      let effectiveRole = currentUserRole || localStorage.getItem('userRole');
      
      // Try to get user role from Supabase if needed
      if (!effectiveRole && isLoggedIn) {
        try {
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (!userError && user) {
            effectiveRole = user.user_metadata?.role || user.user_metadata?.user_type;
            
            if (effectiveRole) {
              localStorage.setItem('userRole', effectiveRole);
              window.dispatchEvent(new Event('storage-event'));
            }
          }
        } catch (error) {
          console.error("Error fetching user from Supabase:", error);
        }
      }
      
      // Check if user is a mechanic
      if (effectiveRole !== 'mechanic') {
        setError("Advertising options are only available for mechanics");
        setHasAccess(false);
        setIsLoading(false);
        return;
      }
      
      // Access granted
      setHasAccess(true);
      setError(null);
      setIsLoading(false);
    };
    
    checkAccess();
  }, [isLoggedIn, authChecked, currentUserRole]);

  const handleRefresh = () => {
    setError(null);
    setIsLoading(true);
    window.dispatchEvent(new Event('storage-event'));
  };

  return {
    error,
    isLoading,
    hasAccess,
    handleRefresh
  };
};

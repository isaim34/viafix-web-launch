
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isLoggedIn, authChecked, currentUserRole } = useAuth();
  const { getProfileRoute } = useAuthRedirect();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  
  // Debug logging
  useEffect(() => {
    console.log("AuthGuard mounted with:", { isLoggedIn, authChecked, currentUserRole });
    
    // Small delay to prevent flickering during auth check
    const timer = setTimeout(() => {
      setIsChecking(false);
      console.log("AuthGuard check completed:", { isLoggedIn, authChecked });
    }, 100);
    
    return () => {
      clearTimeout(timer);
      console.log("AuthGuard unmounted");
    };
  }, [isLoggedIn, authChecked, currentUserRole]);

  // Show simple loading during the brief check period
  if (isChecking || !authChecked) {
    console.log("AuthGuard is still checking...");
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    console.log('User is not logged in, redirecting to signin');
    // Pass the current path as state so we can redirect back after login
    return <Navigate to="/signin" state={{ redirectTo: location.pathname }} />;
  }

  console.log("AuthGuard allowing access to protected route");
  return <>{children}</>;
};

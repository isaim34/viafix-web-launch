
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isLoggedIn, authChecked } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  
  // Debug logging
  useEffect(() => {
    console.log("AuthGuard mounted with:", { isLoggedIn, authChecked });
    
    // Small delay to prevent flickering during auth check
    const timer = setTimeout(() => {
      setIsChecking(false);
      console.log("AuthGuard check completed:", { isLoggedIn, authChecked });
    }, 100);
    
    return () => {
      clearTimeout(timer);
      console.log("AuthGuard unmounted");
    };
  }, [isLoggedIn, authChecked]);

  // Show simple loading during the brief check period
  if (isChecking || !authChecked) {
    console.log("AuthGuard is still checking...");
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    console.log('User is not logged in, redirecting to signin');
    return <Navigate to="/signin" state={{ redirectTo: location.pathname }} />;
  }

  console.log("AuthGuard allowing access to protected route");
  return <>{children}</>;
};

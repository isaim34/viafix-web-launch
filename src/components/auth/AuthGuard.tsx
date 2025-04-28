
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

  useEffect(() => {
    // Small delay to prevent flickering during auth check
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [isLoggedIn]);

  // Show nothing during the brief check period
  if (isChecking || !authChecked) {
    return null;
  }

  if (!isLoggedIn) {
    console.log('User is not logged in, redirecting to signin');
    return <Navigate to="/signin" state={{ redirectTo: location.pathname }} />;
  }

  return <>{children}</>;
};

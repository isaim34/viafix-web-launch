import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';

interface GoogleAuthButtonProps {
  mode?: 'signin' | 'signup';
  userRole?: 'customer' | 'mechanic';  // Added explicit userRole prop
}

export const GoogleAuthButton = ({ mode = 'signin', userRole }: GoogleAuthButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for auth errors on component mount (from redirect)
  useEffect(() => {
    const checkForErrors = async () => {
      const hash = window.location.hash;
      
      // If we have an error in URL hash
      if (hash && hash.includes('error')) {
        const params = new URLSearchParams(hash.substring(1));
        const error = params.get('error');
        const errorDescription = params.get('error_description');
        
        console.error('Auth redirect error:', error, errorDescription);
        toast({
          title: "Authentication Failed",
          description: errorDescription || "An error occurred during Google authentication. Please try again.",
          variant: "destructive"
        });
      }
      
      // Check if we have a session after redirect
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log("User authenticated:", session.user);
        
        // Extract user information from the session
        const userEmail = session.user.email;
        const userName = session.user.user_metadata?.full_name || 
                         userEmail?.split('@')[0] || 
                         'User';
        
        // Store critical auth information in localStorage
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userEmail', userEmail || '');
        localStorage.setItem('userName', userName);
        
        // Use the user type from metadata, or fallback to the provided userRole, or default to customer
        const userType = session.user.user_metadata?.user_type || 
                        session.user.user_metadata?.role || 
                        'customer';
        
        localStorage.setItem('userRole', userType);
        localStorage.setItem('userId', session.user.id);
        
        // Dispatch event to notify all components about auth state change
        window.dispatchEvent(new Event('storage-event'));
        
        toast({
          title: "Success!",
          description: `You've successfully authenticated with Google as a ${userType}.`,
        });
        
        // Redirect based on user type
        if (userType === 'mechanic') {
          navigate('/mechanic-dashboard', { replace: true });
        } else {
          navigate('/profile', { replace: true });
        }
      }
    };
    
    checkForErrors();
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      
      // Use window.location.origin for the base URL without additional paths
      const redirectUrl = `${window.location.origin}`;
      
      // Determine user role based on props or current page
      // If userRole is explicitly provided, use it
      // Otherwise, try to detect from the current URL path
      const determinedRole = userRole || 
                           (location.pathname.includes('mechanic') ? 'mechanic' : 'customer');
      
      console.log(`Initiating Google auth with redirect to: ${redirectUrl} as role: ${determinedRole}`);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: redirectUrl,
          // Always pass user_type to ensure role is set appropriately
          data: { 
            user_type: determinedRole,
            role: determinedRole // Add role as well for backward compatibility
          }
        }
      });

      if (error) {
        console.error('Google auth error:', error);
        toast({
          title: "Authentication Failed",
          description: error.message || "There was an error connecting to Google. Please try again.",
          variant: "destructive"
        });
      } else {
        console.log("Auth initiated successfully, awaiting redirect...", data);
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      if (error instanceof Error) {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      type="button" 
      variant="outline" 
      className="w-full flex items-center justify-center gap-2"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : (
        <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
          <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
            <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
            <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
            <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
            <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
          </g>
        </svg>
      )}
      {isLoading ? 'Connecting...' : `Continue with Google${mode === 'signup' ? ' to sign up' : ''} as ${userRole || (location.pathname.includes('mechanic') ? 'mechanic' : 'customer')}`}
    </Button>
  );
};

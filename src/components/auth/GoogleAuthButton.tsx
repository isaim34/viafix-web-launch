
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { persistUserToLocalStorage } from '@/contexts/auth/authUtils';

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
        
        // Ensure we have the user role either from metadata or fallback
        let determinedRole = session.user.user_metadata?.user_type || 
                            session.user.user_metadata?.role;
        
        // If role is not in metadata, use the prop or infer from URL or localStorage
        if (!determinedRole) {
          // Get role from prop, URL, localStorage, or default
          determinedRole = userRole || 
                         location.pathname.includes('mechanic') ? 'mechanic' : 
                         localStorage.getItem('pendingAuthRole') || 
                         localStorage.getItem('selectedRole') || 
                         'customer';
          console.log(`Role not found in auth metadata, using determined role: ${determinedRole}`);
          
          // Important: Update user metadata with the role if it's missing
          try {
            await supabase.auth.updateUser({
              data: { 
                user_type: determinedRole,
                role: determinedRole
              }
            });
            console.log("Updated user metadata with role:", determinedRole);
          } catch (error) {
            console.error("Error updating user metadata:", error);
          }
        }
        
        console.log("Role being set for authenticated user:", determinedRole);
        
        // Store critical auth information in localStorage with consistent keys
        persistUserToLocalStorage({
          id: session.user.id,
          email: userEmail || '',
          name: userName,
          role: determinedRole
        });
        
        // Add role-specific data
        if (determinedRole === 'mechanic') {
          localStorage.setItem('vendorName', userName);
          
          // Create simple profile if none exists
          if (!localStorage.getItem('mechanicProfile')) {
            const profile = {
              firstName: userName.split(' ')[0] || '',
              lastName: userName.split(' ').slice(1).join(' ') || '',
              specialties: 'General Auto Repair',
              hourlyRate: '75',
              profileImage: ''
            };
            localStorage.setItem('mechanicProfile', JSON.stringify(profile));
          }
        } else {
          // Create simple profile if none exists
          if (!localStorage.getItem('customerProfile')) {
            const profile = {
              firstName: userName.split(' ')[0] || '',
              lastName: userName.split(' ').slice(1).join(' ') || '',
              profileImage: ''
            };
            localStorage.setItem('customerProfile', JSON.stringify(profile));
          }
        }
        
        // Dispatch event to notify all components about auth state change
        window.dispatchEvent(new Event('storage-event'));
        
        toast({
          title: "Success!",
          description: `You've successfully authenticated with Google as a ${determinedRole}.`,
        });
        
        // Redirect based on user type
        if (determinedRole === 'mechanic') {
          navigate('/mechanic-dashboard', { replace: true });
        } else {
          navigate('/profile', { replace: true });
        }
      }
    };
    
    checkForErrors();
  }, [navigate, userRole, location.pathname]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      
      // Use window.location.origin for the base URL without additional paths
      const redirectUrl = `${window.location.origin}`;
      
      // Determine user role based on props, current page, or localStorage
      const determinedRole = userRole || 
                           (location.pathname.includes('mechanic') ? 'mechanic' : 
                           localStorage.getItem('pendingAuthRole') || 
                           localStorage.getItem('selectedRole') || 
                           'customer');
      
      console.log(`Initiating Google auth with redirect to: ${redirectUrl} as role: ${determinedRole}`);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            // Add user_type and role parameters to query string
            user_type: determinedRole,
            role: determinedRole
          },
          redirectTo: redirectUrl
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
        console.log("Auth initiated successfully, awaiting redirect...");
        
        // Add a localStorage item to track the intended role during redirect
        localStorage.setItem('pendingAuthRole', determinedRole);
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
      {isLoading ? 'Connecting...' : `Continue with Google${mode === 'signup' ? ' to sign up' : ''}`}
    </Button>
  );
};


import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ErrorAlertProps {
  error: string | null;
  showSignInButton?: boolean;
}

export const ErrorAlert = ({ error, showSignInButton = true }: ErrorAlertProps) => {
  const navigate = useNavigate();
  
  if (!error) return null;
  
  const isAuthError = error.toLowerCase().includes('sign in') || 
                      error.toLowerCase().includes('logged in') || 
                      error.toLowerCase().includes('auth');
  
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error accessing advertising options</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <p>{error}</p>
        {isAuthError && showSignInButton && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-fit" 
            onClick={() => navigate('/signin')}
          >
            Sign In
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

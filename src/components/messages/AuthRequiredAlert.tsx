
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const AuthRequiredAlert = () => {
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate('/signin', { state: { redirectTo: '/messages' } });
  };

  return (
    <Alert className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Authentication required</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <p>Please sign in to access your messages.</p>
        <Button onClick={handleSignInClick} className="w-fit">
          Sign In
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default AuthRequiredAlert;

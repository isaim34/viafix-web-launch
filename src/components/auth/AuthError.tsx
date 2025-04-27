
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthErrorProps {
  error: string | null;
  onRegisterClick?: () => void;
}

export const AuthError = ({ error, onRegisterClick }: AuthErrorProps) => {
  if (!error) return null;

  return (
    <Alert variant="destructive" className="text-sm">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{error}</AlertDescription>
      {error.includes("Account not found") && onRegisterClick && (
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          className="mt-2 w-full"
          onClick={onRegisterClick}
        >
          Register a new account
        </Button>
      )}
    </Alert>
  );
};

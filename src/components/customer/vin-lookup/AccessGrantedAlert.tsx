
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Check } from 'lucide-react';

interface AccessGrantedAlertProps {
  subscribedEmail: string;
}

const AccessGrantedAlert = ({ subscribedEmail }: AccessGrantedAlertProps) => {
  return (
    <Alert className="bg-green-50 border-green-200 mb-4">
      <Check className="h-4 w-4 text-green-600" />
      <AlertTitle className="text-green-800">Access Granted</AlertTitle>
      <AlertDescription className="text-green-700">
        Welcome! You can now lookup vehicle safety information with the email: {subscribedEmail}
      </AlertDescription>
    </Alert>
  );
};

export default AccessGrantedAlert;

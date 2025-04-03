
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert } from 'lucide-react';

interface SafetyDataAlertProps {
  recallCount: number;
}

const SafetyDataAlert = ({ recallCount }: SafetyDataAlertProps) => {
  if (recallCount === 0) return null;

  return (
    <Alert className="mb-4 border-red-200 bg-red-50">
      <ShieldAlert className="h-4 w-4 text-red-500" />
      <AlertTitle className="text-red-700">Active Recalls Found</AlertTitle>
      <AlertDescription className="text-red-600">
        {recallCount} recall{recallCount !== 1 ? 's' : ''} found for this vehicle. 
        Please contact your dealership to schedule necessary repairs.
      </AlertDescription>
    </Alert>
  );
};

export default SafetyDataAlert;

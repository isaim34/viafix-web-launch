
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Car } from 'lucide-react';
import { VehicleInfo } from '@/services/nhtsa';

interface VehicleInfoDisplayProps {
  vehicleInfo: VehicleInfo;
}

const VehicleInfoDisplay = ({ vehicleInfo }: VehicleInfoDisplayProps) => {
  return (
    <Alert>
      <Car className="h-4 w-4" />
      <AlertTitle>Vehicle Information</AlertTitle>
      <AlertDescription>
        <div className="font-medium">
          {vehicleInfo.modelYear} {vehicleInfo.make} {vehicleInfo.model}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default VehicleInfoDisplay;

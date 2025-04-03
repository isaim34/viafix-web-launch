
import React from 'react';
import { VehicleInfo } from '@/services/nhtsa';
import { Car } from 'lucide-react';

interface VehicleHeaderProps {
  vehicleInfo: VehicleInfo;
}

const VehicleHeader = ({ vehicleInfo }: VehicleHeaderProps) => {
  return (
    <div className="p-6 border rounded-md bg-muted/30">
      <div className="flex items-center gap-4">
        <Car className="h-6 w-6 text-primary" />
        <div>
          <h3 className="text-xl font-medium">
            {vehicleInfo.modelYear} {vehicleInfo.make} {vehicleInfo.model}
          </h3>
          <p className="text-base text-muted-foreground">
            {[
              vehicleInfo.bodyClass, 
              vehicleInfo.engineCylinders && `${vehicleInfo.engineCylinders} cylinder`, 
              vehicleInfo.fuelType
            ].filter(Boolean).join(' • ')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VehicleHeader;

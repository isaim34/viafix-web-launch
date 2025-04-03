
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { VehicleInfo } from '@/services/nhtsa';
import useVehicleSafetyData from '@/hooks/useVehicleSafetyData';
import VehicleIdentificationSection from './vehicle/VehicleIdentificationSection';
import VehicleHeader from './vehicle/VehicleHeader';
import VehicleTabs from './vehicle/VehicleTabs';
import VehicleSystemHeader from './vehicle/VehicleSystemHeader';

interface VehicleIntelligenceSystemProps {
  vin?: string;
  onVinChange?: (vin: string) => void;
  maintenanceRecords?: any[];
}

const VehicleIntelligenceSystem = ({ 
  vin = '', 
  onVinChange,
  maintenanceRecords = []
}: VehicleIntelligenceSystemProps) => {
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo | null>(null);
  const safetyData = useVehicleSafetyData(vin, vehicleInfo);
  
  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="text-center pb-6">
        <VehicleSystemHeader />
      </CardHeader>
      <CardContent className="px-8 pb-8">
        {!vehicleInfo && (
          <VehicleIdentificationSection 
            vin={vin} 
            onVinChange={onVinChange} 
            onVehicleInfoChange={setVehicleInfo} 
          />
        )}
        
        {vehicleInfo && (
          <div className="space-y-8">
            <VehicleHeader vehicleInfo={vehicleInfo} />
            <VehicleTabs 
              vehicleInfo={vehicleInfo} 
              safetyData={safetyData} 
              maintenanceRecords={maintenanceRecords} 
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VehicleIntelligenceSystem;

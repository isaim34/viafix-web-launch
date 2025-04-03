
import React from 'react';
import { VehicleInfo } from '@/services/nhtsa';
import VINInput from '@/components/customer/VINInput';
import { useToast } from '@/hooks/use-toast';

interface VehicleIdentificationSectionProps {
  vin: string;
  onVinChange?: (vin: string) => void;
  onVehicleInfoChange: (info: VehicleInfo | null) => void;
}

const VehicleIdentificationSection = ({ 
  vin, 
  onVinChange, 
  onVehicleInfoChange 
}: VehicleIdentificationSectionProps) => {
  const { toast } = useToast();
  
  const handleVehicleInfoChange = (info: VehicleInfo | null) => {
    onVehicleInfoChange(info);
    
    if (info) {
      toast({
        title: "Vehicle identified",
        description: `${info.modelYear} ${info.make} ${info.model}`,
      });
    }
  };
  
  return (
    <div className="mb-10 max-w-xl mx-auto">
      <h3 className="text-xl font-medium mb-4">Vehicle Identification</h3>
      <VINInput 
        value={vin}
        onChange={(value) => {
          if (onVinChange) onVinChange(value);
        }}
        onVehicleInfoChange={handleVehicleInfoChange}
      />
    </div>
  );
};

export default VehicleIdentificationSection;

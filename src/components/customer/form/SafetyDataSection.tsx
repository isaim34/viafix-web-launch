
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import VehicleSafetyData from '../VehicleSafetyData';
import { MaintenanceRecord } from '@/types/customer';
import { Recall, Complaint, Investigation } from '@/types/customer';

interface SafetyDataSectionProps {
  recalls: Recall[];
  complaints: Complaint[];
  investigations: Investigation[];
  isLoading: boolean;
  error: string | null;
}

const SafetyDataSection = ({ 
  recalls, 
  complaints, 
  investigations, 
  isLoading, 
  error 
}: SafetyDataSectionProps) => {
  const { watch } = useFormContext<MaintenanceRecord>();
  const vin = watch('vin');
  
  if (!vin || vin.length !== 17) {
    return null;
  }
  
  return (
    <Card>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3">Loading vehicle safety data...</span>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-medium mb-3">Vehicle Safety Information</h3>
            <VehicleSafetyData
              recalls={recalls}
              complaints={complaints}
              investigations={investigations}
              error={error}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SafetyDataSection;

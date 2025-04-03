
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wrench, AlertTriangle, FileText, Car } from "lucide-react";
import { VehicleInfo } from '@/services/nhtsa';
import useVehicleSafetyData from '@/hooks/useVehicleSafetyData';
import VINInput from '@/components/customer/VINInput';
import VehicleSafetyData from '@/components/customer/VehicleSafetyData';
import MaintenanceLog from '@/components/fixiq/MaintenanceLog';
import FixIQInsights from '@/components/fixiq/FixIQInsights';
import DealerReferrals from '@/components/fixiq/DealerReferrals';
import { useToast } from '@/hooks/use-toast';

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
  const [vehicleInfo, setVehicleInfo] = React.useState<VehicleInfo | null>(null);
  const { toast } = useToast();
  const safetyData = useVehicleSafetyData(vin, vehicleInfo);
  
  const handleVehicleInfoChange = (info: VehicleInfo | null) => {
    setVehicleInfo(info);
    
    if (info) {
      toast({
        title: "Vehicle identified",
        description: `${info.modelYear} ${info.make} ${info.model}`,
      });
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="text-center pb-0">
        <div className="flex flex-col items-center">
          <img 
            src="/lovable-uploads/1ab9806b-4f6f-4b90-ab8d-dda363292b09.png"
            alt="FixIQ Logo"
            className="h-32 w-auto mb-4"
          />
          <div>
            <CardTitle>Vehicle Intelligence System</CardTitle>
            <CardDescription>
              Intelligent maintenance tracking and safety monitoring for your vehicle
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!vehicleInfo && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Vehicle Identification</h3>
            <VINInput 
              value={vin}
              onChange={(value) => {
                if (onVinChange) onVinChange(value);
              }}
              onVehicleInfoChange={handleVehicleInfoChange}
            />
          </div>
        )}
        
        {vehicleInfo && (
          <div className="space-y-6">
            <div className="p-4 border rounded-md bg-muted/30">
              <div className="flex items-center gap-3">
                <Car className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-medium">
                    {vehicleInfo.modelYear} {vehicleInfo.make} {vehicleInfo.model}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {[
                      vehicleInfo.bodyClass, 
                      vehicleInfo.engineCylinders && `${vehicleInfo.engineCylinders} cylinder`, 
                      vehicleInfo.fuelType
                    ].filter(Boolean).join(' • ')}
                  </p>
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="insights" className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="insights" className="flex items-center gap-1">
                  <img 
                    src="/lovable-uploads/1ab9806b-4f6f-4b90-ab8d-dda363292b09.png" 
                    alt="FixIQ" 
                    className="h-4 w-auto" 
                  />
                  <span className="hidden sm:inline">Insights</span>
                </TabsTrigger>
                <TabsTrigger value="safety" className="flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="hidden sm:inline">Safety Data</span>
                </TabsTrigger>
                <TabsTrigger value="maintenance" className="flex items-center gap-1">
                  <Wrench className="h-4 w-4" />
                  <span className="hidden sm:inline">Maintenance</span>
                </TabsTrigger>
                <TabsTrigger value="dealers" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Dealer Referrals</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="insights">
                <FixIQInsights 
                  vehicleInfo={vehicleInfo}
                  safetyData={safetyData}
                />
              </TabsContent>
              
              <TabsContent value="safety">
                <VehicleSafetyData
                  recalls={safetyData.recalls}
                  complaints={safetyData.complaints}
                  investigations={safetyData.investigations}
                  loading={safetyData.isLoading}
                  error={safetyData.error}
                />
              </TabsContent>
              
              <TabsContent value="maintenance">
                <MaintenanceLog 
                  vehicleInfo={vehicleInfo}
                  maintenanceRecords={maintenanceRecords}
                />
              </TabsContent>
              
              <TabsContent value="dealers">
                <DealerReferrals
                  vehicleInfo={vehicleInfo}
                  recalls={safetyData.recalls}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VehicleIntelligenceSystem;

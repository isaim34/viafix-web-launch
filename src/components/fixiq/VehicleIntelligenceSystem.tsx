
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wrench, AlertTriangle, FileText, Car, Shield } from "lucide-react";
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
    <Card className="w-full shadow-sm">
      <CardHeader className="text-center pb-6">
        <div className="flex flex-col items-center py-6">
          <img 
            src="/lovable-uploads/489f7032-b400-43c3-a86b-2f163b4ca524.png"
            alt="FixIQ Logo"
            className="h-16 w-auto mb-6"
          />
          <div className="mt-2">
            <CardTitle className="text-3xl mb-2">Vehicle Intelligence System</CardTitle>
            <CardDescription className="text-lg max-w-2xl mx-auto">
              Intelligent maintenance tracking and safety monitoring for your vehicle
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        {!vehicleInfo && (
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
        )}
        
        {vehicleInfo && (
          <div className="space-y-8">
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
            
            <Tabs defaultValue="insights" className="w-full">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="insights" className="flex items-center gap-2 py-3">
                  <Car className="h-4 w-4" />
                  <span className="hidden sm:inline">Insights</span>
                </TabsTrigger>
                <TabsTrigger value="safety" className="flex items-center gap-2 py-3">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="hidden sm:inline">Safety Data</span>
                </TabsTrigger>
                <TabsTrigger value="maintenance" className="flex items-center gap-2 py-3">
                  <Wrench className="h-4 w-4" />
                  <span className="hidden sm:inline">Maintenance</span>
                </TabsTrigger>
                <TabsTrigger value="dealers" className="flex items-center gap-2 py-3">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Dealer Referrals</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="insights" className="p-4">
                <FixIQInsights 
                  vehicleInfo={vehicleInfo}
                  safetyData={safetyData}
                />
              </TabsContent>
              
              <TabsContent value="safety" className="p-4">
                <VehicleSafetyData
                  recalls={safetyData.recalls}
                  complaints={safetyData.complaints}
                  investigations={safetyData.investigations}
                  loading={safetyData.isLoading}
                  error={safetyData.error}
                />
              </TabsContent>
              
              <TabsContent value="maintenance" className="p-4">
                <MaintenanceLog 
                  vehicleInfo={vehicleInfo}
                  maintenanceRecords={maintenanceRecords}
                />
              </TabsContent>
              
              <TabsContent value="dealers" className="p-4">
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

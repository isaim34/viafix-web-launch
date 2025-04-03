
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wrench, AlertTriangle, FileText, Car } from "lucide-react";
import { VehicleInfo } from '@/services/nhtsa';
import VehicleSafetyData from '@/components/customer/VehicleSafetyData';
import MaintenanceLog from '@/components/fixiq/MaintenanceLog';
import FixIQInsights from '@/components/fixiq/FixIQInsights';
import DealerReferrals from '@/components/fixiq/DealerReferrals';

interface VehicleTabsProps {
  vehicleInfo: VehicleInfo;
  safetyData: {
    recalls: any[];
    complaints: any[];
    investigations: any[];
    isLoading: boolean;
    error: string | null;
  };
  maintenanceRecords?: any[];
}

const VehicleTabs = ({ 
  vehicleInfo, 
  safetyData, 
  maintenanceRecords = [] 
}: VehicleTabsProps) => {
  return (
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
  );
};

export default VehicleTabs;


import React from 'react';
import { VehicleInfo } from '@/services/nhtsa';
import { MaintenanceRecord } from '@/types/customer';
import MaintenanceLogHeader from './maintenance-log/MaintenanceLogHeader';
import MaintenanceLogEmptyState from './maintenance-log/MaintenanceLogEmptyState';
import MaintenanceTimeline from './maintenance-log/MaintenanceTimeline';

interface MaintenanceLogProps {
  vehicleInfo: VehicleInfo;
  maintenanceRecords?: MaintenanceRecord[];
}

const MaintenanceLog = ({ vehicleInfo, maintenanceRecords = [] }: MaintenanceLogProps) => {
  return (
    <div className="space-y-6">
      <MaintenanceLogHeader 
        vehicleInfo={vehicleInfo}
        maintenanceRecords={maintenanceRecords}
      />
      
      {maintenanceRecords.length === 0 ? (
        <MaintenanceLogEmptyState />
      ) : (
        <MaintenanceTimeline maintenanceRecords={maintenanceRecords} />
      )}
    </div>
  );
};

export default MaintenanceLog;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import { VehicleInfo } from '@/services/nhtsa';
import { MaintenanceRecord } from '@/types/customer';
import { printMaintenanceLog, generateReport } from './printUtils';

interface MaintenanceLogHeaderProps {
  vehicleInfo: VehicleInfo;
  maintenanceRecords: MaintenanceRecord[];
}

const MaintenanceLogHeader = ({ vehicleInfo, maintenanceRecords }: MaintenanceLogHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium">Maintenance Timeline</h3>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={() => generateReport(vehicleInfo)}
        >
          <Download className="h-4 w-4" />
          <span>Export Report</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={() => printMaintenanceLog(vehicleInfo, maintenanceRecords)}
        >
          <Printer className="h-4 w-4" />
          <span>Print</span>
        </Button>
      </div>
    </div>
  );
};

export default MaintenanceLogHeader;

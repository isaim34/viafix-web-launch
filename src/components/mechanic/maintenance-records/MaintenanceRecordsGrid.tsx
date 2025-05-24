
import React from 'react';
import { MaintenanceRecordCard } from './MaintenanceRecordCard';

interface MaintenanceRecord {
  id: string;
  customer_id: string;
  service_type: string;
  description: string;
  date: string;
  mechanic_signature: boolean;
  vehicle_id?: string;
}

interface MaintenanceRecordsGridProps {
  records: MaintenanceRecord[];
  formatDate: (dateString: string) => string;
}

export const MaintenanceRecordsGrid = ({ records, formatDate }: MaintenanceRecordsGridProps) => {
  return (
    <div className="grid gap-4">
      {records.map((record) => (
        <MaintenanceRecordCard 
          key={record.id} 
          record={record} 
          formatDate={formatDate}
        />
      ))}
    </div>
  );
};

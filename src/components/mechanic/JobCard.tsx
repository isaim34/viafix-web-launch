
import React, { useState } from 'react';
import { Calendar, FileText, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CompletedJob } from './types/completedJobTypes';
import { MaintenanceRecordDialog } from './MaintenanceRecordDialog';

interface JobCardProps {
  job: CompletedJob;
}

export const JobCard = ({ job }: JobCardProps) => {
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="relative h-48">
        <img 
          src={job.imageUrls[0]} 
          alt={job.title} 
          className="w-full h-full object-cover"
        />
        {job.imageUrls.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white rounded-full px-2 py-1 text-xs font-medium flex items-center">
            <ImageIcon className="w-3 h-3 mr-1" />
            +{job.imageUrls.length - 1}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-medium">{job.title}</h3>
        <p className="text-sm text-gray-500 mb-2">{job.vehicleType}</p>
        <p className="text-sm mb-2">{job.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(job.completionDate).toLocaleDateString()}
          </span>
          {job.customerName && (
            <span>Customer: {job.customerName}</span>
          )}
        </div>
        
        {job.customerMaintenanceRecord && (
          <div className="mt-3 pt-3 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-1 flex items-center gap-2 text-xs"
              onClick={() => setIsMaintenanceDialogOpen(true)}
            >
              <FileText className="h-3.5 w-3.5" />
              View Customer Maintenance Record
            </Button>
            
            {job.customerMaintenanceRecord && (
              <MaintenanceRecordDialog
                isOpen={isMaintenanceDialogOpen}
                onOpenChange={setIsMaintenanceDialogOpen}
                maintenanceRecord={job.customerMaintenanceRecord}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

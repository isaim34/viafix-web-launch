
import React from 'react';
import { Calendar, FileText } from 'lucide-react';
import { ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clipboard } from 'lucide-react';
import { format } from 'date-fns';
import { CompletedJob } from './types/completedJobTypes';

interface JobCardProps {
  job: CompletedJob;
}

export const JobCard = ({ job }: JobCardProps) => {
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
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-1 flex items-center gap-2 text-xs"
                >
                  <FileText className="h-3.5 w-3.5" />
                  View Customer Maintenance Record
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>FixIQ Maintenance Record</DialogTitle>
                  <DialogDescription>
                    Service details documented in customer's FixIQ maintenance log
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="bg-muted/30 p-3 rounded-md border">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" /> Signed Off
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(job.customerMaintenanceRecord.date), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <h3 className="font-medium mb-1">{job.customerMaintenanceRecord.vehicle}</h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      {job.customerMaintenanceRecord.serviceType}
                    </p>
                    {job.customerMaintenanceRecord.vin && (
                      <p className="text-xs text-muted-foreground mb-3">
                        VIN: {job.customerMaintenanceRecord.vin}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Service Description</h4>
                    <p className="text-sm p-3 bg-muted/20 rounded-md">
                      {job.customerMaintenanceRecord.description}
                    </p>
                  </div>
                  
                  {job.customerMaintenanceRecord.mechanicNotes && 
                   job.customerMaintenanceRecord.mechanicNotes.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Your Notes</h4>
                      <ul className="space-y-2">
                        {job.customerMaintenanceRecord.mechanicNotes.map((note, index) => (
                          <li key={index} className="text-sm flex gap-2">
                            <Clipboard className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
};

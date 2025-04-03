
import React from 'react';
import { format } from 'date-fns';
import { CheckCircle, Clipboard } from 'lucide-react';
import { MaintenanceRecord } from '@/types/customer';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface MaintenanceRecordDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  maintenanceRecord: MaintenanceRecord;
}

export const MaintenanceRecordDialog = ({
  isOpen,
  onOpenChange,
  maintenanceRecord,
}: MaintenanceRecordDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                {format(new Date(maintenanceRecord.date), 'MMM d, yyyy')}
              </span>
            </div>
            <h3 className="font-medium mb-1">{maintenanceRecord.vehicle}</h3>
            <p className="text-sm text-muted-foreground mb-1">
              {maintenanceRecord.serviceType}
            </p>
            {maintenanceRecord.vin && (
              <p className="text-xs text-muted-foreground mb-3">
                VIN: {maintenanceRecord.vin}
              </p>
            )}
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Service Description</h4>
            <p className="text-sm p-3 bg-muted/20 rounded-md">
              {maintenanceRecord.description}
            </p>
          </div>
          
          {maintenanceRecord.mechanicNotes && 
           maintenanceRecord.mechanicNotes.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Your Notes</h4>
              <ul className="space-y-2">
                {maintenanceRecord.mechanicNotes.map((note, index) => (
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
  );
};

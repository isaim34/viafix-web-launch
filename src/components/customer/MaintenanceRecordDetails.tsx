
import React from 'react';
import { Button } from '@/components/ui/button';
import { MaintenanceRecord } from '@/types/customer';
import MechanicNoteForm from './MechanicNoteForm';

interface MaintenanceRecordDetailsProps {
  record: MaintenanceRecord;
  isMechanic: boolean;
  onEdit: () => void;
  onAddNote: (note: string) => void;
}

const MaintenanceRecordDetails = ({ 
  record, 
  isMechanic, 
  onEdit, 
  onAddNote 
}: MaintenanceRecordDetailsProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground">Date</h4>
          <p>{record.date}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground">Vehicle</h4>
          <p>{record.vehicle}</p>
        </div>
        {record.vin && (
          <div className="col-span-2">
            <h4 className="text-sm font-semibold text-muted-foreground">VIN</h4>
            <p className="font-mono">{record.vin}</p>
          </div>
        )}
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground">Service Type</h4>
          <p>{record.serviceType}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground">Mechanic</h4>
          <p>{record.mechanic}</p>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-semibold text-muted-foreground">Description</h4>
        <p className="mt-1 whitespace-pre-wrap">{record.description}</p>
      </div>
      
      {record.mechanicNotes && record.mechanicNotes.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground">Mechanic Notes</h4>
          <div className="mt-2 space-y-2">
            {record.mechanicNotes.map((note, index) => (
              <div key={index} className="bg-muted p-3 rounded-md">
                <p className="whitespace-pre-wrap">{note}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-end gap-2">
        {isMechanic ? (
          <MechanicNoteForm 
            record={record} 
            onAddNote={onAddNote} 
          />
        ) : (
          <Button onClick={onEdit}>
            Edit Record
          </Button>
        )}
      </div>
    </div>
  );
};

export default MaintenanceRecordDetails;

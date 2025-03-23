
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Wrench, Car, Calendar, X } from 'lucide-react';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import { MaintenanceRecord } from '@/types/customer';
import VehicleMaintenanceForm from './VehicleMaintenanceForm';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const VehicleMaintenanceLog = () => {
  const { currentUserId } = useCustomerAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [records, setRecords] = useState<MaintenanceRecord[]>(() => {
    // Load maintenance records from localStorage
    const savedRecords = localStorage.getItem(`customer-${currentUserId}-maintenance`);
    return savedRecords ? JSON.parse(savedRecords) : getSampleRecords();
  });

  const saveRecord = (record: MaintenanceRecord) => {
    const newRecords = [...records, { ...record, id: Date.now().toString() }];
    setRecords(newRecords);
    localStorage.setItem(`customer-${currentUserId}-maintenance`, JSON.stringify(newRecords));
    setShowForm(false);
    toast({
      title: "Maintenance record added",
      description: "Your vehicle maintenance record has been saved",
    });
  };

  const deleteRecord = (id: string) => {
    const newRecords = records.filter(record => record.id !== id);
    setRecords(newRecords);
    localStorage.setItem(`customer-${currentUserId}-maintenance`, JSON.stringify(newRecords));
    toast({
      title: "Record deleted",
      description: "The maintenance record has been removed",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Vehicle Maintenance Log</h2>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Record
        </Button>
      </div>
      
      {showForm ? (
        <Card>
          <CardContent className="pt-6">
            <VehicleMaintenanceForm onSave={saveRecord} onCancel={() => setShowForm(false)} />
          </CardContent>
        </Card>
      ) : null}
      
      {records.length > 0 ? (
        <ScrollArea className="h-[400px] rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead>Mechanic</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {record.date}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      {record.vehicle}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline">{record.serviceType}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>{record.mechanic}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteRecord(record.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      ) : (
        <div className="text-center py-8 text-muted-foreground border rounded-md">
          <Wrench className="mx-auto h-12 w-12 mb-4 text-muted-foreground/70" />
          <h3 className="text-lg font-medium mb-2">No maintenance records</h3>
          <p>Start tracking your vehicle maintenance by adding a record.</p>
        </div>
      )}
    </div>
  );
};

function getSampleRecords(): MaintenanceRecord[] {
  return [
    {
      id: '1',
      date: '2023-10-15',
      vehicle: '2018 Toyota Camry',
      serviceType: 'Oil Change',
      description: 'Regular oil change with full synthetic oil. Replaced oil filter.',
      mechanic: 'Alex Johnson',
      mechanicSignature: true
    },
    {
      id: '2',
      date: '2023-08-22',
      vehicle: '2018 Toyota Camry',
      serviceType: 'Brake Replacement',
      description: 'Replaced front brake pads and rotors. Inspected rear brakes - still good condition.',
      mechanic: 'Sarah Williams',
      mechanicSignature: true
    }
  ];
}

export default VehicleMaintenanceLog;

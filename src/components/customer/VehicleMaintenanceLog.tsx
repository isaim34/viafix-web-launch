
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
import { Plus, Wrench, Car, Calendar, X, FileText, Eye, ShieldAlert } from 'lucide-react';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import { MaintenanceRecord } from '@/types/customer';
import VehicleMaintenanceForm from './VehicleMaintenanceForm';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import VehicleSafetyData from './VehicleSafetyData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const VehicleMaintenanceLog = () => {
  const { currentUserId } = useCustomerAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [viewRecord, setViewRecord] = useState<MaintenanceRecord | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("details");
  const userRole = localStorage.getItem('userRole');
  const isMechanic = userRole === 'mechanic';
  
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

  const updateRecord = (record: MaintenanceRecord) => {
    const newRecords = records.map(r => r.id === record.id ? record : r);
    setRecords(newRecords);
    localStorage.setItem(`customer-${currentUserId}-maintenance`, JSON.stringify(newRecords));
    setViewRecord(null);
    setEditMode(false);
    toast({
      title: "Record updated",
      description: "The maintenance record has been updated",
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

  const addMechanicNote = (record: MaintenanceRecord, note: string) => {
    const updatedRecord = {
      ...record,
      mechanicNotes: record.mechanicNotes ? [...record.mechanicNotes, note] : [note]
    };
    updateRecord(updatedRecord);
  };

  const hasRecalls = (record: MaintenanceRecord) => {
    return record.nhtsaData?.recalls && record.nhtsaData.recalls.length > 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Vehicle Maintenance Log</h2>
        {!isMechanic && (
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Record
          </Button>
        )}
      </div>
      
      {showForm && !isMechanic ? (
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
                <TableHead>Safety</TableHead>
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
                    {hasRecalls(record) ? (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <ShieldAlert className="h-3 w-3" />
                        Recalls
                      </Badge>
                    ) : record.vin ? (
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                        Checked
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-500">
                        No VIN
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => {
                          setViewRecord(record);
                          setActiveTab("details");
                        }}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {!isMechanic && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => deleteRecord(record.id!)}
                          title="Delete Record"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
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

      {/* Record Viewing/Editing Dialog */}
      <Dialog open={!!viewRecord} onOpenChange={(open) => {
        if (!open) {
          setViewRecord(null);
          setEditMode(false);
        }
      }}>
        {viewRecord && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {editMode ? "Edit Maintenance Record" : "Maintenance Record Details"}
              </DialogTitle>
            </DialogHeader>
            
            {editMode ? (
              <VehicleMaintenanceForm 
                onSave={updateRecord} 
                onCancel={() => setEditMode(false)}
                initialData={viewRecord}
              />
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Record Details</TabsTrigger>
                  
                  {viewRecord.vin && (
                    <TabsTrigger value="safety" className="relative">
                      Safety Data
                      {hasRecalls(viewRecord) && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                      )}
                    </TabsTrigger>
                  )}
                </TabsList>
                
                <TabsContent value="details">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground">Date</h4>
                        <p>{viewRecord.date}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground">Vehicle</h4>
                        <p>{viewRecord.vehicle}</p>
                      </div>
                      {viewRecord.vin && (
                        <div className="col-span-2">
                          <h4 className="text-sm font-semibold text-muted-foreground">VIN</h4>
                          <p className="font-mono">{viewRecord.vin}</p>
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground">Service Type</h4>
                        <p>{viewRecord.serviceType}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground">Mechanic</h4>
                        <p>{viewRecord.mechanic}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground">Description</h4>
                      <p className="mt-1 whitespace-pre-wrap">{viewRecord.description}</p>
                    </div>
                    
                    {viewRecord.mechanicNotes && viewRecord.mechanicNotes.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground">Mechanic Notes</h4>
                        <div className="mt-2 space-y-2">
                          {viewRecord.mechanicNotes.map((note, index) => (
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
                          record={viewRecord} 
                          onAddNote={(note) => addMechanicNote(viewRecord, note)} 
                        />
                      ) : (
                        <Button onClick={() => setEditMode(true)}>
                          Edit Record
                        </Button>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                {viewRecord.vin && (
                  <TabsContent value="safety">
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        This data is provided by the National Highway Traffic Safety Administration (NHTSA) 
                        based on the vehicle's VIN. It includes important safety information like recalls, 
                        complaints, and investigations.
                      </p>
                      
                      {viewRecord.nhtsaData ? (
                        <VehicleSafetyData
                          recalls={viewRecord.nhtsaData.recalls || []}
                          complaints={viewRecord.nhtsaData.complaints || []}
                          investigations={viewRecord.nhtsaData.investigations || []}
                        />
                      ) : (
                        <div className="text-center py-6 bg-gray-50 rounded-lg">
                          <p>No safety data available for this vehicle.</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-4"
                            onClick={() => {
                              setEditMode(true);
                              setActiveTab("details");
                            }}
                          >
                            Edit record to fetch safety data
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            )}
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

const MechanicNoteForm = ({ record, onAddNote }: { 
  record: MaintenanceRecord, 
  onAddNote: (note: string) => void 
}) => {
  const [note, setNote] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (note.trim()) {
      onAddNote(note);
      setNote('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="mt-4 w-full">
      <h4 className="text-sm font-semibold mb-2">Add Mechanic Note</h4>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full min-h-[100px] p-2 border rounded-md mb-2"
        placeholder="Add notes about this maintenance record (visible to the customer)"
      />
      <Button type="submit" disabled={!note.trim()} className="w-full">
        <FileText className="mr-2 h-4 w-4" />
        Add Note
      </Button>
    </form>
  );
};

function getSampleRecords(): MaintenanceRecord[] {
  return [
    {
      id: '1',
      date: '2023-10-15',
      vehicle: '2018 Toyota Camry',
      vin: '4T1B11HK1KU123456',
      serviceType: 'Oil Change',
      description: 'Regular oil change with full synthetic oil. Replaced oil filter.',
      mechanic: 'Alex Johnson',
      mechanicSignature: true,
      nhtsaData: {
        recalls: [{
          id: "recall-1",
          campNo: "18V123000",
          component: "Forward Collision Avoidance",
          summary: "The forward collision avoidance system may not detect objects properly.",
          consequence: "Increased risk of crash if the driver relies on the system.",
          remedy: "Dealer will update the software free of charge.",
          notes: "Contact your Toyota dealer as soon as possible.",
          reportedDate: "2023-01-15"
        }],
        complaints: [],
        investigations: []
      }
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

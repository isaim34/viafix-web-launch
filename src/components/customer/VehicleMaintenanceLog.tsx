
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ShieldAlert } from 'lucide-react';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import { MaintenanceRecord } from '@/types/customer';
import VehicleMaintenanceForm from './VehicleMaintenanceForm';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import VehicleSafetyData from './VehicleSafetyData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getSampleRecords } from '@/utils/sampleMaintenanceData';
import MaintenanceRecordTable from './MaintenanceRecordTable';
import EmptyMaintenanceState from './EmptyMaintenanceState';
import MaintenanceRecordDetails from './MaintenanceRecordDetails';

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
        <MaintenanceRecordTable 
          records={records} 
          isMechanic={isMechanic} 
          onViewRecord={(record) => {
            setViewRecord(record);
            setActiveTab("details");
          }}
          onDeleteRecord={deleteRecord}
        />
      ) : (
        <EmptyMaintenanceState />
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
                  <MaintenanceRecordDetails 
                    record={viewRecord}
                    isMechanic={isMechanic}
                    onEdit={() => setEditMode(true)}
                    onAddNote={(note) => addMechanicNote(viewRecord, note)}
                  />
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

export default VehicleMaintenanceLog;

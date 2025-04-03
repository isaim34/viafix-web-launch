
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { MaintenanceRecord } from '@/types/customer';
import MaintenanceRecordTable from './MaintenanceRecordTable';
import EmptyMaintenanceState from './EmptyMaintenanceState';
import VehicleMaintenanceForm from './VehicleMaintenanceForm';
import VehicleIntelligenceSystem from '../fixiq/VehicleIntelligenceSystem';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

// Import sample data (in a real app, this would come from an API)
import { sampleMaintenanceRecords } from '@/utils/sampleMaintenanceData';

const VehicleMaintenanceLog = () => {
  const [records, setRecords] = useState<MaintenanceRecord[]>(sampleMaintenanceRecords);
  const [isAdding, setIsAdding] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MaintenanceRecord | null>(null);
  const [selectedVin, setSelectedVin] = useState<string>('');
  const { toast } = useToast();
  
  const handleSaveRecord = (record: MaintenanceRecord) => {
    if (record.id) {
      // Update existing record
      setRecords(records.map(r => r.id === record.id ? record : r));
      setEditingRecord(null);
      toast({
        title: "Record updated",
        description: "The maintenance record has been updated",
      });
    } else {
      // Add new record with a generated ID
      const newRecord = {
        ...record,
        id: Date.now().toString(),
      };
      setRecords([...records, newRecord]);
      setIsAdding(false);
      toast({
        title: "Record added",
        description: "A new maintenance record has been added",
      });
      
      // If this is the first record with a VIN, set it as the selected VIN
      if (record.vin && !selectedVin) {
        setSelectedVin(record.vin);
      }
    }
  };
  
  const handleDelete = (id: string) => {
    setRecords(records.filter(record => record.id !== id));
    toast({
      title: "Record deleted",
      description: "The maintenance record has been deleted",
    });
  };
  
  // Get records for the selected VIN
  const filteredRecords = selectedVin 
    ? records.filter(record => record.vin === selectedVin)
    : records;
  
  // Get all unique VINs from records
  const vehicleVins = [...new Set(records.filter(r => r.vin).map(r => r.vin as string))];
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="maintenance" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="maintenance">Maintenance Log</TabsTrigger>
          <TabsTrigger value="fixiq">FixIQ Dashboard</TabsTrigger>
        </TabsList>
        
        <TabsContent value="maintenance">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Vehicle Maintenance Records</h2>
              <Button 
                onClick={() => {
                  setIsAdding(true);
                  setEditingRecord(null);
                }}
                disabled={isAdding || !!editingRecord}
                className="flex items-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Add Record
              </Button>
            </div>
            
            {isAdding && (
              <Card className="p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Add Maintenance Record</h3>
                <VehicleMaintenanceForm
                  onSave={handleSaveRecord}
                  onCancel={() => setIsAdding(false)}
                />
              </Card>
            )}
            
            {editingRecord && (
              <Card className="p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Edit Maintenance Record</h3>
                <VehicleMaintenanceForm
                  initialData={editingRecord}
                  onSave={handleSaveRecord}
                  onCancel={() => setEditingRecord(null)}
                />
              </Card>
            )}
            
            {records.length === 0 && !isAdding ? (
              <EmptyMaintenanceState onAddClick={() => setIsAdding(true)} />
            ) : (
              <MaintenanceRecordTable
                records={filteredRecords}
                onEdit={setEditingRecord}
                onDeleteRecord={handleDelete}
              />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="fixiq">
          <VehicleIntelligenceSystem 
            vin={selectedVin}
            onVinChange={setSelectedVin}
            maintenanceRecords={filteredRecords}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VehicleMaintenanceLog;

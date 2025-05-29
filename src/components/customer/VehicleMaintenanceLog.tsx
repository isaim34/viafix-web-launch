
import React, { useState } from 'react';
import { MaintenanceRecord } from '@/types/customer';
import VehicleIntelligenceSystem from '../fixiq/VehicleIntelligenceSystem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMaintenanceLog } from './maintenance-log/useMaintenanceLog';
import { useMaintenanceRecordOperations } from './maintenance-log/MaintenanceRecordOperations';
import { MaintenanceLogActions } from './maintenance-log/MaintenanceLogActions';
import { MaintenanceLogContent } from './maintenance-log/MaintenanceLogContent';
import { MyVehiclesSection } from './vehicles/MyVehiclesSection';

const VehicleMaintenanceLog = () => {
  const [editingRecord, setEditingRecord] = useState<MaintenanceRecord | null>(null);
  const [selectedVin, setSelectedVin] = useState<string>('');
  
  const { records, isLoading, setRecords, refetchRecords } = useMaintenanceLog();
  const { handleSaveRecord, handleDelete } = useMaintenanceRecordOperations();
  
  const onSaveRecord = async (record: MaintenanceRecord) => {
    await handleSaveRecord(record);
    setEditingRecord(null);
    refetchRecords();
    
    // If this is the first record with a VIN, set it as the selected VIN
    if (record.vin && !selectedVin) {
      setSelectedVin(record.vin);
    }
  };
  
  const onDeleteRecord = async (id: string) => {
    await handleDelete(id);
    // Update local state
    setRecords(records.filter(record => record.id !== id));
  };
  
  // Get records for the selected VIN
  const filteredRecords = selectedVin 
    ? records.filter(record => record.vin === selectedVin)
    : records;
  
  // Set initial selected VIN if records exist with VINs
  React.useEffect(() => {
    if (records.length > 0 && !selectedVin) {
      const firstRecordWithVin = records.find(r => r.vin);
      if (firstRecordWithVin?.vin) {
        setSelectedVin(firstRecordWithVin.vin);
      }
    }
  }, [records, selectedVin]);
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="vehicles" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="vehicles">My Vehicles</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance Log</TabsTrigger>
          <TabsTrigger value="fixiq">FixIQ Dashboard</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vehicles">
          <MyVehiclesSection />
        </TabsContent>
        
        <TabsContent value="maintenance">
          <div className="space-y-6">
            <MaintenanceLogActions
              onSaveRecord={onSaveRecord}
              editingRecord={editingRecord}
              setEditingRecord={setEditingRecord}
            />
            
            <MaintenanceLogContent
              isLoading={isLoading}
              records={records}
              filteredRecords={filteredRecords}
              onEdit={setEditingRecord}
              onDelete={onDeleteRecord}
              onAddClick={() => setEditingRecord(null)}
            />
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

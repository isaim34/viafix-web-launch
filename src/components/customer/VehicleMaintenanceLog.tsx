
import React, { useState, useEffect } from 'react';
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
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const VehicleMaintenanceLog = () => {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MaintenanceRecord | null>(null);
  const [selectedVin, setSelectedVin] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const auth = useAuth();
  
  useEffect(() => {
    fetchMaintenanceRecords();
  }, [auth.user?.id]);
  
  const fetchMaintenanceRecords = async () => {
    setIsLoading(true);
    try {
      const userId = auth.user?.id || localStorage.getItem('userId');
      
      if (!userId) {
        console.log('No user ID found for maintenance records');
        setIsLoading(false);
        return;
      }
      
      console.log('Fetching maintenance records for user ID:', userId);
      
      const { data, error } = await supabase
        .from('maintenance_records')
        .select(`
          id,
          date,
          vehicle_id,
          service_type,
          description,
          mechanic_id,
          mechanic_signature,
          vehicles(make, model, year, vin)
        `)
        .eq('customer_id', userId);
      
      if (error) {
        console.error('Error fetching maintenance records:', error);
        toast({
          title: "Failed to load records",
          description: error.message,
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      // Map the database records to our MaintenanceRecord format
      const formattedRecords: MaintenanceRecord[] = data.map(record => ({
        id: record.id,
        date: new Date(record.date).toISOString().split('T')[0],
        vehicle: record.vehicles ? `${record.vehicles.year} ${record.vehicles.make} ${record.vehicles.model}` : 'Unknown Vehicle',
        vin: record.vehicles?.vin || undefined,
        serviceType: record.service_type,
        description: record.description,
        mechanic: record.mechanic_id ? 'Service Professional' : 'Self-Recorded',
        mechanicSignature: record.mechanic_signature || false
      }));
      
      console.log('Fetched maintenance records:', formattedRecords);
      setRecords(formattedRecords);
      
      // Set initial selected VIN if records exist with VINs
      if (formattedRecords.length > 0 && !selectedVin) {
        const firstRecordWithVin = formattedRecords.find(r => r.vin);
        if (firstRecordWithVin?.vin) {
          setSelectedVin(firstRecordWithVin.vin);
        }
      }
    } catch (error) {
      console.error('Error in fetching maintenance records:', error);
      toast({
        title: "Error loading records",
        description: "There was a problem loading your maintenance records",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveRecord = async (record: MaintenanceRecord) => {
    try {
      const userId = auth.user?.id || localStorage.getItem('userId');
      
      if (!userId) {
        toast({
          title: "Authentication error",
          description: "Please log in to save records",
          variant: "destructive"
        });
        return;
      }
      
      // Find or create vehicle record first if we have a VIN
      let vehicleId = null;
      if (record.vin) {
        // Check if vehicle exists
        const { data: existingVehicles } = await supabase
          .from('vehicles')
          .select('id')
          .eq('vin', record.vin)
          .eq('owner_id', userId)
          .maybeSingle();
        
        if (existingVehicles?.id) {
          vehicleId = existingVehicles.id;
        } else {
          // Extract vehicle info from the vehicle string (format: "YEAR MAKE MODEL")
          const vehicleParts = record.vehicle.split(' ');
          const year = parseInt(vehicleParts[0]) || new Date().getFullYear();
          const make = vehicleParts[1] || 'Unknown';
          const model = vehicleParts.slice(2).join(' ') || 'Unknown';
          
          // Create new vehicle
          const { data: newVehicle, error: vehicleError } = await supabase
            .from('vehicles')
            .insert({
              owner_id: userId,
              make,
              model,
              year,
              vin: record.vin
            })
            .select('id')
            .single();
          
          if (vehicleError) {
            throw new Error(`Failed to save vehicle: ${vehicleError.message}`);
          }
          
          vehicleId = newVehicle.id;
        }
      }
      
      if (record.id) {
        // Update existing record
        const { error } = await supabase
          .from('maintenance_records')
          .update({
            service_type: record.serviceType,
            description: record.description,
            mechanic_signature: record.mechanicSignature,
            vehicle_id: vehicleId,
            date: record.date
          })
          .eq('id', record.id);
        
        if (error) {
          throw new Error(`Failed to update record: ${error.message}`);
        }
        
        setEditingRecord(null);
        toast({
          title: "Record updated",
          description: "The maintenance record has been updated",
        });
      } else {
        // Add new record
        const { error } = await supabase
          .from('maintenance_records')
          .insert({
            customer_id: userId,
            vehicle_id: vehicleId,
            service_type: record.serviceType,
            description: record.description,
            mechanic_signature: record.mechanicSignature,
            date: record.date
          });
        
        if (error) {
          throw new Error(`Failed to save record: ${error.message}`);
        }
        
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
      
      // Refresh the records list
      fetchMaintenanceRecords();
      
    } catch (error) {
      console.error('Error saving record:', error);
      toast({
        title: "Error saving record",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };
  
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('maintenance_records')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw new Error(`Failed to delete record: ${error.message}`);
      }
      
      // Update local state
      setRecords(records.filter(record => record.id !== id));
      
      toast({
        title: "Record deleted",
        description: "The maintenance record has been deleted",
      });
    } catch (error) {
      console.error('Error deleting record:', error);
      toast({
        title: "Error deleting record",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    }
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
            
            {isLoading ? (
              <Card className="p-6 flex justify-center items-center h-40">
                <p>Loading maintenance records...</p>
              </Card>
            ) : records.length === 0 && !isAdding ? (
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

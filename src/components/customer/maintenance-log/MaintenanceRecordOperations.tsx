
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { MaintenanceRecord } from '@/types/customer';

export const useMaintenanceRecordOperations = () => {
  const { toast } = useToast();
  const auth = useAuth();

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
        
        toast({
          title: "Record added",
          description: "A new maintenance record has been added",
        });
      }
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

  return {
    handleSaveRecord,
    handleDelete
  };
};

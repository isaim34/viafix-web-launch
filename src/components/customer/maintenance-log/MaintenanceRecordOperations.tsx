
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

      console.log('Saving maintenance record for user:', userId);
      
      // Validate user ID format - if it's not a UUID, show appropriate error
      const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId);
      
      if (!isValidUUID) {
        console.warn('User ID is not a valid UUID:', userId);
        toast({
          title: "Account Error",
          description: "Please use a proper customer account to save maintenance records",
          variant: "destructive"
        });
        return;
      }
      
      // Find or create vehicle record first if we have a VIN
      let vehicleId = null;
      if (record.vin) {
        console.log('Looking for existing vehicle with VIN:', record.vin);
        
        // Check if vehicle exists
        const { data: existingVehicles } = await supabase
          .from('vehicles')
          .select('id')
          .eq('vin', record.vin)
          .eq('owner_id', userId)
          .maybeSingle();
        
        if (existingVehicles?.id) {
          vehicleId = existingVehicles.id;
          console.log('Found existing vehicle:', vehicleId);
        } else {
          // Extract vehicle info from the vehicle string (format: "YEAR MAKE MODEL")
          const vehicleParts = record.vehicle.split(' ');
          const year = parseInt(vehicleParts[0]) || new Date().getFullYear();
          const make = vehicleParts[1] || 'Unknown';
          const model = vehicleParts.slice(2).join(' ') || 'Unknown';
          
          console.log('Creating new vehicle:', { userId, make, model, year, vin: record.vin });
          
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
            console.error('Vehicle creation error:', vehicleError);
            throw new Error(`Failed to save vehicle: ${vehicleError.message}`);
          }
          
          vehicleId = newVehicle.id;
          console.log('Created new vehicle:', vehicleId);
        }
      }
      
      // Prepare enhanced record data
      const recordData = {
        service_type: record.serviceType,
        description: record.description,
        mechanic_signature: record.mechanicSignature,
        vehicle_id: vehicleId,
        date: record.date,
        work_category: record.workCategory || 'repair',
        signature_timestamp: record.mechanicSignature ? new Date().toISOString() : null,
        signature_ip_address: record.mechanicSignature ? 'auto-tracked' : null,
      };
      
      if (record.id) {
        // Update existing record
        console.log('Updating existing maintenance record:', record.id);
        
        const { error } = await supabase
          .from('maintenance_records')
          .update(recordData)
          .eq('id', record.id);
        
        if (error) {
          console.error('Maintenance record update error:', error);
          throw new Error(`Failed to update record: ${error.message}`);
        }
        
        toast({
          title: "Record updated",
          description: "The maintenance record has been updated with enhanced tracking",
        });
      } else {
        // Add new record
        console.log('Creating new maintenance record');
        
        const { error } = await supabase
          .from('maintenance_records')
          .insert({
            customer_id: userId,
            ...recordData
          });
        
        if (error) {
          console.error('Maintenance record creation error:', error);
          throw new Error(`Failed to save record: ${error.message}`);
        }
        
        toast({
          title: "Record added",
          description: "A new maintenance record has been added with enhanced tracking features",
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
      console.log('Deleting maintenance record:', id);
      
      const { error } = await supabase
        .from('maintenance_records')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Maintenance record deletion error:', error);
        throw new Error(`Failed to delete record: ${error.message}`);
      }
      
      toast({
        title: "Record deleted",
        description: "The maintenance record and all associated images have been deleted",
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

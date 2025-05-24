
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MaintenanceRecordFormData } from './types';

export const useMaintenanceSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitMaintenanceRecord = async (
    data: MaintenanceRecordFormData,
    customerId: string,
    serviceId?: string,
    existingMaintenanceRecord?: any,
    customerVehicle?: any,
    customOfferId?: string
  ) => {
    setIsSubmitting(true);
    
    try {
      const mechanicId = localStorage.getItem('userId');
      
      if (!mechanicId) {
        throw new Error('Mechanic ID not found');
      }

      let vehicleId = customerVehicle?.id;
      
      // Create vehicle record if it doesn't exist
      if (!vehicleId) {
        const vehicleInfo = data.vehicle_info.split(' ');
        const year = parseInt(vehicleInfo[0]) || new Date().getFullYear();
        const make = vehicleInfo[1] || 'Unknown';
        const model = vehicleInfo.slice(2).join(' ') || 'Unknown';

        const { data: newVehicle, error: vehicleError } = await supabase
          .from('vehicles')
          .insert({
            owner_id: customerId,
            year: year,
            make: make,
            model: model,
          })
          .select()
          .single();

        if (vehicleError) throw vehicleError;
        vehicleId = newVehicle.id;
      }

      if (existingMaintenanceRecord) {
        // Update existing maintenance record by adding to the description
        const updatedDescription = `${existingMaintenanceRecord.description}\n\n--- Additional Work by Mechanic ---\n${data.description}`;
        
        const { error } = await supabase
          .from('maintenance_records')
          .update({
            description: updatedDescription,
            mechanic_id: mechanicId,
            mechanic_signature: true,
            updated_at: new Date().toISOString(),
            custom_offer_id: customOfferId,
          })
          .eq('id', existingMaintenanceRecord.id);

        if (error) throw error;
      } else {
        // Create new maintenance record
        const { error } = await supabase
          .from('maintenance_records')
          .insert({
            customer_id: customerId,
            mechanic_id: mechanicId,
            vehicle_id: vehicleId,
            service_type: data.service_type,
            description: data.description,
            mechanic_signature: true,
            date: new Date().toISOString(),
            custom_offer_id: customOfferId,
          });

        if (error) throw error;
      }

      // If this is related to a service booking, update it to completed
      if (serviceId) {
        await supabase
          .from('service_bookings')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            completion_notes: data.completion_notes,
            parts_used: data.parts_used,
            labor_hours: data.labor_hours,
          })
          .eq('id', serviceId);
      }

      toast({
        title: "Success",
        description: existingMaintenanceRecord 
          ? "Work added to existing maintenance record successfully"
          : "Maintenance record created successfully",
      });

      return true;
    } catch (error) {
      console.error('Error handling maintenance record:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to handle maintenance record",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitMaintenanceRecord,
    isSubmitting
  };
};

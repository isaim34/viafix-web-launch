
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface CustomerVehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  vin?: string;
  isPrimary: boolean;
  maintenanceCount: number;
  recallCount: number;
  lastService?: {
    date: string;
    type: string;
    mechanic: string;
  };
}

export const useMyVehicles = () => {
  const [vehicles, setVehicles] = useState<CustomerVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchVehicles = async () => {
    if (!user?.id) return;

    try {
      // Get customer's vehicles
      const { data: customerVehicles } = await supabase
        .from('customer_vehicles')
        .select(`
          id,
          is_primary,
          vehicles (
            id,
            year,
            make,
            model,
            vin
          )
        `)
        .eq('customer_id', user.id);

      if (!customerVehicles) {
        setLoading(false);
        return;
      }

      const vehicleData = await Promise.all(
        customerVehicles.map(async (cv: any) => {
          const vehicle = cv.vehicles;
          
          // Get maintenance count
          const { data: maintenanceRecords } = await supabase
            .from('maintenance_records')
            .select('id, date, service_type, mechanic_id')
            .eq('vehicle_id', vehicle.id)
            .order('date', { ascending: false });

          // Get recall count
          const { data: recalls } = await supabase
            .from('recalls')
            .select('id')
            .eq('vehicle_id', vehicle.id);

          // Get last service info
          let lastService = null;
          if (maintenanceRecords && maintenanceRecords.length > 0) {
            const lastRecord = maintenanceRecords[0];
            
            // Get mechanic info if available
            let mechanicName = 'Self-recorded';
            if (lastRecord.mechanic_id) {
              const { data: mechanicProfile } = await supabase
                .from('profiles')
                .select('first_name, last_name')
                .eq('id', lastRecord.mechanic_id)
                .single();
              
              if (mechanicProfile) {
                mechanicName = `${mechanicProfile.first_name || ''} ${mechanicProfile.last_name || ''}`.trim();
              }
            }

            lastService = {
              date: lastRecord.date,
              type: lastRecord.service_type,
              mechanic: mechanicName
            };
          }

          return {
            id: vehicle.id,
            year: vehicle.year,
            make: vehicle.make,
            model: vehicle.model,
            vin: vehicle.vin,
            isPrimary: cv.is_primary,
            maintenanceCount: maintenanceRecords?.length || 0,
            recallCount: recalls?.length || 0,
            lastService
          };
        })
      );

      setVehicles(vehicleData);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const addVehicle = () => {
    // This would open a modal or navigate to add vehicle form
    console.log('Add vehicle functionality to be implemented');
  };

  useEffect(() => {
    fetchVehicles();
  }, [user?.id]);

  return { vehicles, loading, addVehicle, refetch: fetchVehicles };
};

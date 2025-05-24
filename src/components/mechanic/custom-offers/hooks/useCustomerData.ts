
import { supabase } from '@/integrations/supabase/client';

export const useCustomerData = () => {
  const fetchCustomerMaintenanceAndVehicle = async (customerId: string) => {
    try {
      const { data: maintenanceData, error: maintenanceError } = await supabase
        .from('maintenance_records')
        .select('*')
        .eq('customer_id', customerId)
        .order('date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (maintenanceError && maintenanceError.code !== 'PGRST116') {
        throw maintenanceError;
      }

      const { data: vehicleData, error: vehicleError } = await supabase
        .from('vehicles')
        .select('*')
        .eq('owner_id', customerId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (vehicleError && vehicleError.code !== 'PGRST116') {
        throw vehicleError;
      }

      return { maintenanceRecord: maintenanceData, vehicle: vehicleData };
    } catch (error) {
      console.error('Error fetching customer data:', error);
      return { maintenanceRecord: null, vehicle: null };
    }
  };

  return { fetchCustomerMaintenanceAndVehicle };
};


import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { MaintenanceRecord } from '@/types/customer';

export const useMaintenanceLog = () => {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const auth = useAuth();

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

  useEffect(() => {
    fetchMaintenanceRecords();
  }, [auth.user?.id]);

  return {
    records,
    isLoading,
    setRecords,
    refetchRecords: fetchMaintenanceRecords
  };
};


import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MaintenanceRecord {
  id: string;
  customer_id: string;
  service_type: string;
  description: string;
  date: string;
  mechanic_signature: boolean;
  vehicle_id?: string;
}

export const useMaintenanceRecords = () => {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchMaintenanceRecords = async () => {
    try {
      setIsLoading(true);
      const mechanicId = localStorage.getItem('userId');
      
      if (!mechanicId) {
        console.log('No mechanic ID found');
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('maintenance_records')
        .select('*')
        .eq('mechanic_id', mechanicId)
        .order('date', { ascending: false });

      if (error) throw error;

      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching maintenance records:', error);
      toast({
        title: "Error",
        description: "Failed to load maintenance records",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceRecords();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return {
    records,
    isLoading,
    formatDate,
    refetchRecords: fetchMaintenanceRecords
  };
};

import { useState, useEffect } from 'react';
import { 
  VehicleInfo, 
  fetchAllNHTSAData, 
  NHTSAData 
} from '@/services/nhtsa';

export const useVehicleSafetyData = (vin?: string, vehicleInfo?: VehicleInfo | null) => {
  const [data, setData] = useState<NHTSAData>({
    recalls: [],
    complaints: [],
    investigations: [],
    isLoading: false,
    error: null
  });
  
  const fetchData = async (info: VehicleInfo) => {
    setData(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const result = await fetchAllNHTSAData(info);
      setData(result);
    } catch (error) {
      setData({
        recalls: [],
        complaints: [],
        investigations: [],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch vehicle safety data'
      });
    }
  };
  
  useEffect(() => {
    if (vehicleInfo) {
      fetchData(vehicleInfo);
    }
  }, [vehicleInfo]);
  
  return data;
};

export default useVehicleSafetyData;

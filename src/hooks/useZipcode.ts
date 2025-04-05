
import { useState } from 'react';
import { getZipcodeInfo, ZipcodeResponse, ZipcodeError } from '@/services/zipcodeService';

interface UseZipcodeResult {
  locationData: ZipcodeResponse | null;
  isLoading: boolean;
  error: ZipcodeError | null;
  fetchLocationData: (zipCode: string, countryCode?: string) => Promise<void>;
  reset: () => void;
}

export const useZipcode = (): UseZipcodeResult => {
  const [locationData, setLocationData] = useState<ZipcodeResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ZipcodeError | null>(null);
  
  const fetchLocationData = async (zipCode: string, countryCode: string = 'us') => {
    if (!zipCode) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getZipcodeInfo(zipCode, countryCode);
      setLocationData(data);
    } catch (err) {
      setError(err as ZipcodeError);
      setLocationData(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const reset = () => {
    setLocationData(null);
    setError(null);
    setIsLoading(false);
  };
  
  return {
    locationData,
    isLoading,
    error,
    fetchLocationData,
    reset
  };
};

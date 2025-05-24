
import { useState, useCallback, useMemo } from 'react';
import { zipcodeService } from '@/services/zipcodeService';

export const useZipcode = () => {
  const [locationData, setLocationData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchLocationData = useCallback(async (zipCode: string) => {
    if (!zipCode || zipCode.length !== 5) {
      setLocationData(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await zipcodeService.getLocationByZipCode(zipCode);
      setLocationData(data);
    } catch (err) {
      console.error('Error fetching location data:', err);
      setError('Failed to fetch location data');
      setLocationData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLocationData(null);
    setError(null);
    setLoading(false);
  }, []);

  const memoizedReturn = useMemo(() => ({
    fetchLocationData,
    locationData,
    error,
    loading,
    reset
  }), [fetchLocationData, locationData, error, loading, reset]);

  return memoizedReturn;
};

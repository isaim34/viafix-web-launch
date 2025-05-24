
import { useState, useCallback, useMemo } from 'react';
import { getZipcodeInfo, ZipcodeResponse, ZipcodeError } from '@/services/zipcodeService';

export const useZipcode = () => {
  const [locationData, setLocationData] = useState<ZipcodeResponse | null>(null);
  const [error, setError] = useState<ZipcodeError | null>(null);
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
      const data = await getZipcodeInfo(zipCode);
      setLocationData(data);
    } catch (err) {
      console.error('Error fetching location data:', err);
      setError(err as ZipcodeError);
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


import { useState, useEffect } from 'react';
import { VehicleInfo } from '@/services/nhtsa';

export const useVINLookupState = () => {
  const [vin, setVin] = useState('');
  const [isDecoding, setIsDecoding] = useState(false);
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo | null>(null);
  const [vinError, setVinError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState('');

  // Check for existing subscription on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('vin_lookup_email');
    if (savedEmail) {
      console.log('🔄 Restoring saved subscription for:', savedEmail);
      setSubscribedEmail(savedEmail);
      setIsSubscribed(true);
    }
  }, []);

  const handleVINChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert to uppercase and remove non-alphanumeric characters
    const formatted = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    // Only allow VINs up to 17 characters
    if (formatted.length <= 17) {
      setVin(formatted);
      // Reset states when VIN changes
      if (vehicleInfo) {
        setVehicleInfo(null);
      }
      if (vinError) {
        setVinError(null);
      }
    }
  };

  const resetForm = () => {
    console.log('🔄 Resetting form');
    setVin('');
    setVehicleInfo(null);
    setVinError(null);
  };

  return {
    vin,
    isDecoding,
    vehicleInfo,
    vinError,
    isSubscribed,
    subscribedEmail,
    setIsDecoding,
    setVehicleInfo,
    setVinError,
    setIsSubscribed,
    setSubscribedEmail,
    handleVINChange,
    resetForm
  };
};

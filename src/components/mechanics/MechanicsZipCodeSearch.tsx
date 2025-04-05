
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, X } from 'lucide-react';

interface MechanicsZipCodeSearchProps {
  zipCode: string;
  setZipCode: (zipCode: string) => void;
}

const MechanicsZipCodeSearch = ({ zipCode, setZipCode }: MechanicsZipCodeSearchProps) => {
  const navigate = useNavigate();
  
  const handleZipCodeSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipCode) {
      navigate(`/mechanics?zipCode=${zipCode}`);
    }
  };

  const handleClearZipCode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Clear the zip code
    setZipCode('');
    
    // Set a flag in session storage to indicate the user has manually cleared the zip code
    sessionStorage.setItem('zipCodeManuallyCleared', 'true');
    
    // Navigate without zip code parameter
    navigate('/mechanics');
    
    // Add a small delay before allowing auto-population to prevent race conditions
    setTimeout(() => {
      console.log('Zip code cleared successfully');
    }, 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.slice(0, 5);
    setZipCode(newValue);
    
    // If the user is actually typing something new, remove the manually cleared flag
    if (newValue) {
      sessionStorage.removeItem('zipCodeManuallyCleared');
    }
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleZipCodeSearch} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow max-w-xs">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Enter zip code"
            className="pl-10 pr-10"
            value={zipCode}
            onChange={handleInputChange}
            pattern="[0-9]*"
            inputMode="numeric"
            maxLength={5}
          />
          {zipCode && (
            <button
              type="button"
              aria-label="Clear zip code"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={handleClearZipCode}
            >
              <X size={16} />
            </button>
          )}
        </div>
        <Button type="submit" variant="default" size="default" disabled={!zipCode}>
          Search by Zip Code
        </Button>
      </form>
    </div>
  );
};

export default MechanicsZipCodeSearch;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/Button';
import { MapPin } from 'lucide-react';

interface MechanicsZipCodeSearchProps {
  zipCode: string;
  setZipCode: (zipCode: string) => void;
}

const MechanicsZipCodeSearch = ({ zipCode, setZipCode }: MechanicsZipCodeSearchProps) => {
  const navigate = useNavigate();
  
  const handleZipCodeSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/mechanics?zipCode=${zipCode}`);
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleZipCodeSearch} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow max-w-xs">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Enter zip code"
            className="pl-10"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value.slice(0, 5))}
            pattern="[0-9]*"
            inputMode="numeric"
            maxLength={5}
          />
        </div>
        <Button type="submit" size="default">
          Search by Zip Code
        </Button>
      </form>
    </div>
  );
};

export default MechanicsZipCodeSearch;

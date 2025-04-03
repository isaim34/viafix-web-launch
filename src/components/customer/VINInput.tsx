import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle, Check, Loader2 } from 'lucide-react';
import { decodeVin, VehicleInfo } from '@/services/nhtsa';

interface VINInputProps {
  value: string;
  onChange: (value: string) => void;
  onVehicleInfoChange?: (vehicleInfo: VehicleInfo | null) => void;
}

const VINInput = ({ value, onChange, onVehicleInfoChange }: VINInputProps) => {
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo | null>(null);
  
  const validateVIN = async () => {
    if (!value || value.length < 17) {
      setIsValid(false);
      setVehicleInfo(null);
      if (onVehicleInfoChange) onVehicleInfoChange(null);
      return;
    }
    
    setIsValidating(true);
    
    try {
      const info = await decodeVin(value);
      setIsValid(!!info);
      setVehicleInfo(info);
      if (onVehicleInfoChange) onVehicleInfoChange(info);
    } catch (error) {
      setIsValid(false);
      setVehicleInfo(null);
      if (onVehicleInfoChange) onVehicleInfoChange(null);
    } finally {
      setIsValidating(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert to uppercase and remove non-alphanumeric characters
    const formatted = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    // Only allow VINs up to 17 characters
    if (formatted.length <= 17) {
      onChange(formatted);
      // Reset validation state when input changes
      if (isValid !== null) {
        setIsValid(null);
        setVehicleInfo(null);
      }
    }
  };
  
  return (
    <div className="space-y-2">
      <div>
        <Label htmlFor="vin">Vehicle Identification Number (VIN)</Label>
        <div className="relative mt-1">
          <Input
            id="vin"
            value={value}
            onChange={handleChange}
            placeholder="Enter 17-character VIN"
            className={`pr-10 ${
              isValid === true ? 'border-green-500 focus-visible:ring-green-500' : 
              isValid === false ? 'border-red-500 focus-visible:ring-red-500' : ''
            }`}
            maxLength={17}
          />
          {isValid === true && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-green-500">
              <Check className="h-4 w-4" />
            </div>
          )}
          {isValid === false && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-red-500">
              <AlertCircle className="h-4 w-4" />
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={validateVIN}
          disabled={isValidating || !value || value.length !== 17}
        >
          {isValidating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Validating...
            </>
          ) : (
            'Validate VIN'
          )}
        </Button>
        
        {vehicleInfo && (
          <div className="text-sm space-y-1">
            <p className="font-medium text-foreground">
              {vehicleInfo.modelYear} {vehicleInfo.make} {vehicleInfo.model}
              {vehicleInfo.trim && ` ${vehicleInfo.trim}`}
            </p>
            {(vehicleInfo.bodyClass || vehicleInfo.driveType) && (
              <p className="text-muted-foreground">
                {[vehicleInfo.bodyClass, vehicleInfo.driveType].filter(Boolean).join(' • ')}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VINInput;

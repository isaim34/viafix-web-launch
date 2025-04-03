
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Car, AlertCircle, Check, ExternalLink } from 'lucide-react';
import { decodeVin, VehicleInfo } from '@/services/nhtsa';
import VehicleSafetyData from './VehicleSafetyData';
import useVehicleSafetyData from '@/hooks/useVehicleSafetyData';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const VINLookupTool = () => {
  const [vin, setVin] = useState('');
  const [isDecoding, setIsDecoding] = useState(false);
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const safetyData = useVehicleSafetyData(vin, vehicleInfo);
  
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
      if (error) {
        setError(null);
      }
    }
  };
  
  const handleLookup = async () => {
    if (!vin || vin.length !== 17) {
      setError("Please enter a valid 17-character VIN");
      return;
    }
    
    setIsDecoding(true);
    setError(null);
    
    try {
      const info = await decodeVin(vin);
      setVehicleInfo(info);
      if (!info) {
        setError("Could not decode this VIN. Please check if it's correct.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to decode VIN");
      setVehicleInfo(null);
    } finally {
      setIsDecoding(false);
    }
  };
  
  const resetForm = () => {
    setVin('');
    setVehicleInfo(null);
    setError(null);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Vehicle Safety Lookup</CardTitle>
        <CardDescription>
          Enter your Vehicle Identification Number (VIN) to check for recalls, complaints, and safety investigations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vin-lookup">Vehicle Identification Number (VIN)</Label>
            <div className="flex space-x-2">
              <Input
                id="vin-lookup"
                value={vin}
                onChange={handleVINChange}
                placeholder="Enter 17-character VIN"
                className="font-mono"
                maxLength={17}
                disabled={isDecoding}
              />
              <Button 
                type="button"
                onClick={handleLookup}
                disabled={isDecoding || !vin || vin.length !== 17}
              >
                {isDecoding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  'Lookup'
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              The VIN can be found on your vehicle registration, insurance card, or driver's side dashboard
            </p>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {vehicleInfo && (
            <Alert>
              <Car className="h-4 w-4" />
              <AlertTitle>Vehicle Information</AlertTitle>
              <AlertDescription>
                <div className="font-medium">
                  {vehicleInfo.modelYear} {vehicleInfo.make} {vehicleInfo.model}
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          {vehicleInfo && !safetyData.isLoading && !safetyData.error && (
            <VehicleSafetyData
              recalls={safetyData.recalls}
              complaints={safetyData.complaints}
              investigations={safetyData.investigations}
              loading={safetyData.isLoading}
              error={safetyData.error}
            />
          )}
          
          {safetyData.isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3">Loading vehicle safety data...</span>
            </div>
          )}
        </div>
      </CardContent>
      {vehicleInfo && (
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" onClick={resetForm}>
            Check Another Vehicle
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => window.open(`https://www.nhtsa.gov/recalls?vin=${vin}`, '_blank', 'noopener,noreferrer')}
          >
            NHTSA Recall Lookup 
            <ExternalLink className="h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default VINLookupTool;


import { toast } from "@/hooks/use-toast";
import { VehicleInfo } from "./types";

export const decodeVin = async (vin: string): Promise<VehicleInfo | null> => {
  try {
    const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to decode VIN');
    }
    
    // Extract first result from the array
    const result = data.Results?.[0];
    if (!result) {
      throw new Error('No decode results found');
    }
    
    // Map the detailed vehicle information
    const vehicleInfo: VehicleInfo = {
      make: result.Make,
      model: result.Model,
      modelYear: result.ModelYear,
      bodyClass: result.BodyClass,
      engineCylinders: result.EngineCylinders,
      driveType: result.DriveType,
      vehicleType: result.VehicleType,
      fuelType: result.FuelTypePrimary,
      doors: result.Doors,
      trim: result.Trim,
      displacement: result.DisplacementL,
      transmissionStyle: result.TransmissionStyle
    };
    
    // Validate required fields
    if (!vehicleInfo.make || !vehicleInfo.model || !vehicleInfo.modelYear) {
      toast({
        title: "Incomplete VIN Data",
        description: "Could not extract complete vehicle information from the VIN",
        variant: "destructive"
      });
      return null;
    }
    
    return vehicleInfo;
  } catch (error) {
    console.error('Error decoding VIN:', error);
    toast({
      title: "VIN Decoding Failed",
      description: error instanceof Error ? error.message : "Failed to decode VIN",
      variant: "destructive"
    });
    return null;
  }
};

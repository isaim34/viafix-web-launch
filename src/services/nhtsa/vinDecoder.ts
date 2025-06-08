
import { toast } from "@/hooks/use-toast";
import { VehicleInfo } from "./types";

export const decodeVin = async (vin: string): Promise<VehicleInfo | null> => {
  console.log('🔍 Starting VIN decode for:', vin);
  
  try {
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`;
    console.log('📡 Making request to NHTSA API:', url);
    
    const response = await fetch(url);
    console.log('📥 NHTSA API response status:', response.status, response.statusText);
    
    if (!response.ok) {
      console.error('❌ NHTSA API request failed:', response.status, response.statusText);
      throw new Error(`NHTSA API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('📊 NHTSA API response data:', data);
    
    // Extract first result from the array
    const result = data.Results?.[0];
    if (!result) {
      console.error('❌ No decode results found in response');
      throw new Error('No decode results found');
    }
    
    console.log('🔍 Raw vehicle data from NHTSA:', {
      Make: result.Make,
      Model: result.Model,
      ModelYear: result.ModelYear,
      ErrorCode: result.ErrorCode,
      ErrorText: result.ErrorText
    });
    
    // Check for NHTSA API errors
    if (result.ErrorCode && result.ErrorCode !== "0") {
      console.error('❌ NHTSA returned error:', result.ErrorCode, result.ErrorText);
      throw new Error(result.ErrorText || 'VIN decode failed');
    }
    
    // Map the detailed vehicle information
    const vehicleInfo: VehicleInfo = {
      vin: vin, // Store the original VIN
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
    
    console.log('✅ Mapped vehicle info:', vehicleInfo);
    
    // Validate required fields
    if (!vehicleInfo.make || !vehicleInfo.model || !vehicleInfo.modelYear) {
      console.error('❌ Incomplete vehicle data:', {
        make: vehicleInfo.make,
        model: vehicleInfo.model,
        modelYear: vehicleInfo.modelYear
      });
      throw new Error('Could not extract complete vehicle information from the VIN');
    }
    
    console.log('🎉 VIN decode successful for:', `${vehicleInfo.modelYear} ${vehicleInfo.make} ${vehicleInfo.model}`);
    return vehicleInfo;
  } catch (error) {
    console.error('💥 Error in VIN decode process:', error);
    
    // More specific error messages
    let errorMessage = 'Failed to decode VIN';
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        errorMessage = 'Network error - please check your internet connection and try again';
      } else if (error.message.includes('NHTSA API request failed')) {
        errorMessage = 'NHTSA service is temporarily unavailable. Please try again later.';
      } else if (error.message.includes('No decode results')) {
        errorMessage = 'Invalid VIN - no vehicle information found';
      } else if (error.message.includes('complete vehicle information')) {
        errorMessage = 'Incomplete vehicle data from VIN - please verify the VIN is correct';
      } else {
        errorMessage = error.message;
      }
    }
    
    toast({
      title: "VIN Lookup Failed",
      description: errorMessage,
      variant: "destructive"
    });
    
    return null;
  }
};

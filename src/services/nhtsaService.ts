import { toast } from "@/hooks/use-toast";

export interface VehicleInfo {
  make: string;
  model: string;
  modelYear: string;
  bodyClass?: string;
  engineCylinders?: string;
  driveType?: string;
  vehicleType?: string;
  fuelType?: string;
  doors?: string;
  trim?: string;
  displacement?: string;
  transmissionStyle?: string;
}

export interface Recall {
  id: string;
  campNo: string;
  component: string;
  summary: string;
  consequence: string;
  remedy: string;
  notes: string;
  reportedDate: string;
}

export interface Complaint {
  id: string;
  odiNumber: string;
  failureDate: string;
  dateAdded: string;
  component: string;
  summary: string;
}

export interface Investigation {
  id: string;
  actionNumber: string;
  openDate: string;
  componentDescription: string;
  summary: string;
  investigationType: string;
}

export interface NHTSAData {
  recalls: Recall[];
  complaints: Complaint[];
  investigations: Investigation[];
  isLoading: boolean;
  error: string | null;
}

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

export const fetchRecalls = async (vehicleInfo: VehicleInfo): Promise<Recall[]> => {
  try {
    const { make, model, modelYear } = vehicleInfo;
    const url = `https://api.nhtsa.gov/recalls/recallsByVehicle?make=${make}&model=${model}&modelYear=${modelYear}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch recalls');
    }
    
    return data.results?.map((recall: any, index: number) => ({
      id: recall.NHTSACampaignNumber || `recall-${index}`,
      campNo: recall.NHTSACampaignNumber || 'N/A',
      component: recall.Component || 'N/A',
      summary: recall.Summary || 'No summary available',
      consequence: recall.Conequence || 'Not specified',
      remedy: recall.Remedy || 'No remedy specified',
      notes: recall.Notes || '',
      reportedDate: recall.ReportReceivedDate || 'Unknown'
    })) || [];
  } catch (error) {
    console.error('Error fetching recalls:', error);
    return [];
  }
};

export const fetchComplaints = async (vehicleInfo: VehicleInfo): Promise<Complaint[]> => {
  try {
    const { make, model, modelYear } = vehicleInfo;
    const url = `https://api.nhtsa.gov/complaints/complaintsByVehicle?make=${make}&model=${model}&modelYear=${modelYear}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch complaints');
    }
    
    return data.results?.map((complaint: any, index: number) => ({
      id: complaint.odiNumber || `complaint-${index}`,
      odiNumber: complaint.odiNumber || 'N/A',
      failureDate: complaint.failureDate || 'Unknown',
      dateAdded: complaint.dateAdded || 'Unknown',
      component: complaint.components || 'Not specified',
      summary: complaint.summary || 'No description available'
    })) || [];
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return [];
  }
};

export const fetchInvestigations = async (vehicleInfo: VehicleInfo): Promise<Investigation[]> => {
  try {
    const { make, model, modelYear } = vehicleInfo;
    const url = `https://api.nhtsa.gov/SafetyIssue?make=${make}&model=${model}&modelYear=${modelYear}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch investigations');
    }
    
    return data.results?.map((investigation: any, index: number) => ({
      id: investigation.actionNumber || `investigation-${index}`,
      actionNumber: investigation.actionNumber || 'N/A',
      openDate: investigation.openDate || 'Unknown',
      componentDescription: investigation.componentDescription || 'Not specified',
      summary: investigation.summary || 'No summary available',
      investigationType: investigation.investigationType || 'Unknown'
    })) || [];
  } catch (error) {
    console.error('Error fetching investigations:', error);
    return [];
  }
};

export const fetchAllNHTSAData = async (vehicleInfo: VehicleInfo): Promise<NHTSAData> => {
  try {
    const [recalls, complaints, investigations] = await Promise.all([
      fetchRecalls(vehicleInfo),
      fetchComplaints(vehicleInfo),
      fetchInvestigations(vehicleInfo)
    ]);
    
    return {
      recalls,
      complaints,
      investigations,
      isLoading: false,
      error: null
    };
  } catch (error) {
    console.error('Error fetching NHTSA data:', error);
    return {
      recalls: [],
      complaints: [],
      investigations: [],
      isLoading: false,
      error: error instanceof Error ? error.message : 'Failed to fetch vehicle safety data'
    };
  }
};


import { toast } from "@/hooks/use-toast";

export interface VehicleInfo {
  make: string;
  model: string;
  modelYear: string;
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

// Decode VIN to extract vehicle information
export const decodeVin = async (vin: string): Promise<VehicleInfo | null> => {
  try {
    const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to decode VIN');
    }
    
    // Extract relevant vehicle info from the response
    const results = data.Results;
    const makeItem = results.find((item: any) => item.Variable === 'Make');
    const modelItem = results.find((item: any) => item.Variable === 'Model');
    const yearItem = results.find((item: any) => item.Variable === 'Model Year');
    
    const make = makeItem?.Value;
    const model = modelItem?.Value;
    const modelYear = yearItem?.Value;
    
    if (!make || !model || !modelYear) {
      toast({
        title: "VIN Decoding Issue",
        description: "Could not extract complete vehicle information from the VIN",
        variant: "destructive"
      });
      return null;
    }
    
    return {
      make,
      model,
      modelYear
    };
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

// Fetch recalls for a specific vehicle
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

// Fetch complaints for a specific vehicle
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

// Fetch safety investigations for a specific vehicle
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

// Fetch all NHTSA data for a vehicle
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

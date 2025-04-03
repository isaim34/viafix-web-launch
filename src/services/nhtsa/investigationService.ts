
import { Investigation, VehicleInfo } from "./types";

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

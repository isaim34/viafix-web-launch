
import { Recall, VehicleInfo } from "./types";

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


import { Complaint, VehicleInfo } from "./types";

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


import { NHTSAData, VehicleInfo } from "./types";
import { fetchRecalls } from "./recallService";
import { fetchComplaints } from "./complaintService";
import { fetchInvestigations } from "./investigationService";

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

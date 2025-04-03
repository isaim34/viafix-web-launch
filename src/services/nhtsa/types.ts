
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

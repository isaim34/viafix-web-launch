
export interface CustomerProfile {
  firstName: string;
  lastName: string;
  profileImage?: string;
}

export interface MaintenanceRecord {
  id?: string;
  date: string;
  vehicle: string;
  vin?: string;
  serviceType: string;
  description: string;
  mechanic: string;
  mechanicSignature: boolean;
  mechanicNotes?: string[];
  workCategory?: 'repair' | 'maintenance' | 'inspection' | 'diagnostic' | 'custom';
  signatureTimestamp?: string;
  signatureIpAddress?: string;
  imageCount?: number;
  nhtsaData?: {
    recalls: Recall[];
    complaints: Complaint[];
    investigations: Investigation[];
  };
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

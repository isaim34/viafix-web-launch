
export interface CustomerProfile {
  firstName: string;
  lastName: string;
  profileImage?: string;
}

export interface MaintenanceRecord {
  id?: string;
  date: string;
  vehicle: string;
  serviceType: string;
  description: string;
  mechanic: string;
  mechanicSignature: boolean;
  mechanicNotes?: string[];
}

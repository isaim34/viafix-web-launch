
import { MaintenanceRecord } from '@/types/customer';

export interface CompletedJob {
  id: string;
  title: string;
  description: string;
  vehicleType: string;
  completionDate: string;
  imageUrls: string[];
  customerName?: string;
  customerMaintenanceRecord?: MaintenanceRecord;
}

export interface CompletedJobsProps {
  jobs?: CompletedJob[];
  mechanicId: string;
}

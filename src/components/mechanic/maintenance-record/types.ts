
import * as z from 'zod';

export const maintenanceRecordSchema = z.object({
  service_type: z.string().min(2, "Service type is required"),
  description: z.string().min(10, "Please provide a detailed description"),
  vehicle_info: z.string().min(2, "Vehicle information is required"),
  parts_used: z.string().optional(),
  labor_hours: z.number().min(0).optional(),
  completion_notes: z.string().optional(),
});

export type MaintenanceRecordFormData = z.infer<typeof maintenanceRecordSchema>;

export interface MaintenanceRecordFormProps {
  customerId: string;
  serviceId?: string;
  serviceName?: string;
  existingMaintenanceRecord?: any;
  customerVehicle?: any;
  customOfferId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

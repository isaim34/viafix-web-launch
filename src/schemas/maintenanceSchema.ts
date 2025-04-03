
import * as z from 'zod';

export const maintenanceRecordSchema = z.object({
  id: z.string().optional(),
  date: z.string(),
  vehicle: z.string().min(2, "Vehicle details are required"),
  vin: z.string().optional(),
  serviceType: z.string().min(2, "Service type is required"),
  description: z.string().min(10, "Please provide a detailed description"),
  mechanic: z.string().min(2, "Mechanic name is required"),
  mechanicSignature: z.boolean(),
  mechanicNotes: z.array(z.string()).optional(),
  nhtsaData: z.object({
    recalls: z.array(z.any()),
    complaints: z.array(z.any()),
    investigations: z.array(z.any())
  }).optional(),
});

export type MaintenanceRecordFormValues = z.infer<typeof maintenanceRecordSchema>;

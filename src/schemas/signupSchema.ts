
import * as z from 'zod';

// Base user schema with common fields for both customer and mechanic
export const baseUserSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  zipCode: z.string().regex(/^\d{5}$/, "Please enter a valid 5-digit zip code"),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the Terms of Service to continue",
  }),
});

// Mechanic-specific schema extends the base user schema
export const mechanicFormSchema = baseUserSchema.extend({
  specialties: z.string().min(5, "Please list at least one specialty"),
  hourlyRate: z.string().regex(/^\d+$/, "Please enter a valid hourly rate"),
});

export type MechanicFormValues = z.infer<typeof mechanicFormSchema>;
export type BaseUserFormValues = z.infer<typeof baseUserSchema>;

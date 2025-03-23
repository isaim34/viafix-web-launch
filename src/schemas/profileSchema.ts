
import * as z from 'zod';

export const basicProfileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  zipCode: z.string().regex(/^\d{5}$/, "Please enter a valid 5-digit zip code"),
  phone: z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit phone number"),
  hourlyRate: z.coerce.number().min(1, "Hourly rate must be at least $1"),
  profileImage: z.string().url("Please enter a valid URL").optional(),
  yearsExperience: z.coerce.number().min(0, "Experience can't be negative"),
  about: z.string().min(20, "About section must be at least 20 characters"),
  specialties: z.string().min(3, "Specialties are required"),
});

export type BasicProfileFormValues = z.infer<typeof basicProfileSchema>;

export const sampleMechanicProfile = {
  firstName: 'Alex',
  lastName: 'Johnson',
  zipCode: '90210',
  phone: '3105550123',
  hourlyRate: 85,
  profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
  yearsExperience: 8,
  about: "Certified master mechanic with over 8 years of experience specializing in German and Japanese vehicles. I take pride in providing honest, high-quality service at fair prices. My mobile setup allows me to perform most repairs and maintenance directly at your location.",
  specialties: "Engine Repair, Diagnostics, Oil Changes, Brake Replacement",
};

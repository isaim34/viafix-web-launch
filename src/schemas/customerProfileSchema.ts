
import * as z from 'zod';

export const customerProfileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  profileImage: z.string().url("Please enter a valid URL").optional(),
});

export type CustomerProfileFormValues = z.infer<typeof customerProfileSchema>;

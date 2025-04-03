
import { z } from 'zod';

// Schema definition
export const gigSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.coerce.number().min(1, "Price must be at least $1"),
  duration: z.string().min(1, "Duration is required"),
  image: z.union([
    z.instanceof(File).optional(),
    z.string().optional()
  ]).optional(),
});

export type GigFormValues = z.infer<typeof gigSchema>;

export interface Gig {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  status: string;
}

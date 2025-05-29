
import * as z from 'zod';

export const massMessageSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  content: z.string().min(20, { message: "Message must be at least 20 characters" }),
  targetArea: z.string({ required_error: "Please select a target area" }),
  scheduleOption: z.enum(["now", "later"]),
  scheduledDate: z.string().optional(),
  customZipCode: z.string().optional(),
});

export type MassMessageFormData = z.infer<typeof massMessageSchema>;

export interface MassMessageFormProps {
  messagesAvailable: number;
  messageCost: number;
  onSend: (messageCount: number) => boolean;
}

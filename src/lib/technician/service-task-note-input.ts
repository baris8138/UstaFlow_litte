import { z } from "zod";

export const serviceTaskNoteInputSchema = z.object({
  serviceRequestId: z.string().trim().uuid(),
  technicianId: z.string().trim().uuid(),
  content: z.string().trim().min(1).max(2000),
});

export type ServiceTaskNoteInput = z.infer<
  typeof serviceTaskNoteInputSchema
>;

import { z } from "zod";

export const technicianAssignmentSchema = z.object({
  serviceRequestId: z.string().trim().uuid(),
  technicianId: z.string().trim().uuid().nullable(),
});

export type TechnicianAssignmentInput = z.infer<
  typeof technicianAssignmentSchema
>;

import { z } from "zod";

const scheduledAtSchema = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const normalized = value.trim();

  return normalized === "" ? null : new Date(normalized);
}, z.date().nullable().default(null));

export const serviceRequestCreateSchema = z.object({
  customerId: z.string().trim().uuid(),
  title: z.string().trim().min(3).max(160),
  description: z.string().trim().min(10).max(5000),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  scheduledAt: scheduledAtSchema,
});

export type ServiceRequestCreateInput = z.infer<
  typeof serviceRequestCreateSchema
>;

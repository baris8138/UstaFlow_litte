import { z } from "zod";

const plannedAtSchema = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const normalized = value.trim();

  return normalized === "" ? null : new Date(normalized);
}, z.date().nullable());

export const serviceRequestScheduleSchema = z.object({
  serviceRequestId: z.string().trim().uuid(),
  plannedAt: plannedAtSchema,
});

export type ServiceRequestScheduleInput = {
  serviceRequestId: string;
  plannedAt: string | null;
};

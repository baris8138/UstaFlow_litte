import {
  ServiceRequestPriority,
  ServiceRequestStatus,
} from "@/generated/prisma/client";
import { z } from "zod";

const optionalSearchSchema = z.preprocess(
  (value) => {
    if (typeof value !== "string") {
      return value;
    }

    const search = value.trim();
    return search === "" ? undefined : search;
  },
  z.string().max(100).optional(),
);

const technicianFilterSchema = z.union([
  z.literal("UNASSIGNED"),
  z.string().trim().uuid(),
]);

const pageSchema = z.coerce.number().int().min(1).default(1);

export const serviceRequestListFilterSchema = z.object({
  search: optionalSearchSchema,
  status: z.nativeEnum(ServiceRequestStatus).optional(),
  priority: z.nativeEnum(ServiceRequestPriority).optional(),
  technician: technicianFilterSchema.optional(),
  page: pageSchema,
}).default({ page: 1 });

export type ServiceRequestListFilter = z.infer<
  typeof serviceRequestListFilterSchema
>;

export type ParseServiceRequestListFilterResult =
  | { success: true; filters: ServiceRequestListFilter }
  | { success: false; code: "INVALID_FILTER" };

export function parseServiceRequestListFilter(
  input: unknown,
): ParseServiceRequestListFilterResult {
  const parsed = serviceRequestListFilterSchema.safeParse(input);

  return parsed.success
    ? { success: true, filters: parsed.data }
    : { success: false, code: "INVALID_FILTER" };
}

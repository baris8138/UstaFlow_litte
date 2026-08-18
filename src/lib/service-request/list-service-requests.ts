import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { parseServiceRequestListFilter } from "@/lib/service-request/service-request-list-filter";
import {
  serviceRequestListItemSelect,
  type ServiceRequestListItem,
} from "@/lib/service-request/service-request-list-item";

export class InvalidServiceRequestListFilterError extends Error {
  readonly code = "INVALID_FILTER";

  constructor() {
    super("Invalid service request list filter.");
    this.name = "InvalidServiceRequestListFilterError";
  }
}

export async function listServiceRequests(filters?: unknown): Promise<
  ServiceRequestListItem[]
> {
  const parsed = parseServiceRequestListFilter(filters);

  if (!parsed.success) {
    throw new InvalidServiceRequestListFilterError();
  }

  const { search, status, priority, technician } = parsed.filters;
  const where: Prisma.ServiceRequestWhereInput = {
    status,
    priority,
    technicianId:
      technician === "UNASSIGNED" ? null : technician,
    OR: search
      ? [
          { title: { contains: search, mode: "insensitive" } },
          {
            customer: {
              name: { contains: search, mode: "insensitive" },
            },
          },
        ]
      : undefined,
  };

  return prisma.serviceRequest.findMany({
    where,
    select: serviceRequestListItemSelect,
    orderBy: [{ createdAt: "desc" }, { title: "asc" }],
  });
}

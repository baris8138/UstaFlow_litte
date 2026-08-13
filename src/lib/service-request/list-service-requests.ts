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

export const SERVICE_REQUEST_PAGE_SIZE = 10;

export type ServiceRequestListPagination = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type ServiceRequestListResult = ServiceRequestListItem[] & {
  items: ServiceRequestListItem[];
  pagination: ServiceRequestListPagination;
};

export function getServiceRequestTotalPages(totalItems: number) {
  return totalItems === 0
    ? 0
    : Math.ceil(totalItems / SERVICE_REQUEST_PAGE_SIZE);
}

export function getServiceRequestPageSkip(page: number) {
  return (page - 1) * SERVICE_REQUEST_PAGE_SIZE;
}

export async function listServiceRequests(filters?: unknown): Promise<
  ServiceRequestListResult
> {
  const parsed = parseServiceRequestListFilter(filters);

  if (!parsed.success) {
    throw new InvalidServiceRequestListFilterError();
  }

  const { search, status, priority, technician, page } = parsed.filters;
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

  const [totalItems, items] = await prisma.$transaction([
    prisma.serviceRequest.count({ where }),
    prisma.serviceRequest.findMany({
      where,
      skip: getServiceRequestPageSkip(page),
      take: SERVICE_REQUEST_PAGE_SIZE,
      select: serviceRequestListItemSelect,
      orderBy: [
        { createdAt: "desc" },
        { title: "asc" },
        { id: "asc" },
      ],
    }),
  ]);
  const totalPages = getServiceRequestTotalPages(totalItems);
  const pagination: ServiceRequestListPagination = {
    page,
    pageSize: SERVICE_REQUEST_PAGE_SIZE,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1 && totalPages > 0,
    hasNextPage: page < totalPages,
  };

  return Object.assign([...items], { items, pagination });
}

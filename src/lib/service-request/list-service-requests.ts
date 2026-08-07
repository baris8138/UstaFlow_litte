import { prisma } from "@/lib/prisma";
import {
  serviceRequestListItemSelect,
  type ServiceRequestListItem,
} from "@/lib/service-request/service-request-list-item";

export async function listServiceRequests(): Promise<
  ServiceRequestListItem[]
> {
  return prisma.serviceRequest.findMany({
    select: serviceRequestListItemSelect,
    orderBy: [{ createdAt: "desc" }, { title: "asc" }],
  });
}

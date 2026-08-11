import type { Prisma } from "@/generated/prisma/client";

export const serviceRequestListItemSelect = {
  id: true,
  customerId: true,
  technicianId: true,
  title: true,
  description: true,
  status: true,
  priority: true,
  scheduledAt: true,
  createdAt: true,
  updatedAt: true,
  customer: {
    select: {
      id: true,
      name: true,
      type: true,
      isActive: true,
    },
  },
} satisfies Prisma.ServiceRequestSelect;

export type ServiceRequestListItem = Prisma.ServiceRequestGetPayload<{
  select: typeof serviceRequestListItemSelect;
}>;

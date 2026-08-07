import type { Prisma } from "@/generated/prisma/client";

export const serviceRequestViewSelect = {
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
} satisfies Prisma.ServiceRequestSelect;

export type ServiceRequestView = Prisma.ServiceRequestGetPayload<{
  select: typeof serviceRequestViewSelect;
}>;

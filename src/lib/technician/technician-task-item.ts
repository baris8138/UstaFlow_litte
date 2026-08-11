import type { Prisma } from "@/generated/prisma/client";

export const technicianTaskItemSelect = {
  id: true,
  customerId: true,
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
      phone: true,
      addressLine: true,
      city: true,
      district: true,
    },
  },
} satisfies Prisma.ServiceRequestSelect;

export type TechnicianTaskItem = Prisma.ServiceRequestGetPayload<{
  select: typeof technicianTaskItemSelect;
}>;

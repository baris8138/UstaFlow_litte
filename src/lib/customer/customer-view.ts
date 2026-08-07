import type { Prisma } from "@/generated/prisma/client";

export const customerViewSelect = {
  id: true,
  name: true,
  type: true,
  phone: true,
  email: true,
  addressLine: true,
  city: true,
  district: true,
  postalCode: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.CustomerSelect;

export type CustomerView = Prisma.CustomerGetPayload<{
  select: typeof customerViewSelect;
}>;

import type { Prisma } from "@/generated/prisma/client";

export const technicianListItemSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
} satisfies Prisma.UserSelect;

export type TechnicianListItem = Prisma.UserGetPayload<{
  select: typeof technicianListItemSelect;
}>;

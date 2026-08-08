import { prisma } from "@/lib/prisma";
import {
  technicianListItemSelect,
  type TechnicianListItem,
} from "@/lib/technician/technician-list-item";

export async function listActiveTechnicians(): Promise<
  TechnicianListItem[]
> {
  return prisma.user.findMany({
    where: {
      role: "TECHNICIAN",
      isActive: true,
    },
    select: technicianListItemSelect,
    orderBy: [
      { firstName: "asc" },
      { lastName: "asc" },
      { email: "asc" },
    ],
  });
}

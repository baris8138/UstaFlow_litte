import { prisma } from "@/lib/prisma";
import {
  technicianTaskItemSelect,
  type TechnicianTaskItem,
} from "@/lib/technician/technician-task-item";

export async function listAssignedTasks(
  technicianId: string,
): Promise<TechnicianTaskItem[]> {
  return prisma.serviceRequest.findMany({
    where: {
      technicianId,
    },
    select: technicianTaskItemSelect,
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });
}

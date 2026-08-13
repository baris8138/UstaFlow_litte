import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  serviceTaskMaterialViewSelect,
  toServiceTaskMaterialView,
  type ServiceTaskMaterialView,
} from "@/lib/technician/service-task-material-view";
import { z } from "zod";

const listServiceTaskMaterialsInputSchema = z.object({
  serviceRequestId: z.string().trim().uuid(),
  technicianId: z.string().trim().uuid(),
});

export type ListServiceTaskMaterialsResult =
  | { success: true; materials: ServiceTaskMaterialView[] }
  | {
      success: false;
      code:
        | "INVALID_INPUT"
        | "SERVICE_REQUEST_NOT_FOUND"
        | "NOT_ASSIGNED_TO_TECHNICIAN";
    };

export async function listServiceTaskMaterials(
  serviceRequestId: string,
  technicianId: string,
): Promise<ListServiceTaskMaterialsResult> {
  const parsed = listServiceTaskMaterialsInputSchema.safeParse({
    serviceRequestId,
    technicianId,
  });

  if (!parsed.success) {
    return { success: false, code: "INVALID_INPUT" };
  }

  const validatedInput = parsed.data;

  return prisma.$transaction(async (transaction) => {
    const serviceRequest = await transaction.serviceRequest.findUnique({
      where: { id: validatedInput.serviceRequestId },
      select: { id: true, technicianId: true },
    });

    if (serviceRequest === null) {
      return { success: false, code: "SERVICE_REQUEST_NOT_FOUND" };
    }

    if (serviceRequest.technicianId !== validatedInput.technicianId) {
      return { success: false, code: "NOT_ASSIGNED_TO_TECHNICIAN" };
    }

    const ownedRows = await transaction.$queryRaw<Array<{ id: string }>>(
      Prisma.sql`
        SELECT "id"
        FROM "service_requests"
        WHERE "id" = ${validatedInput.serviceRequestId}
          AND "technicianId" = ${validatedInput.technicianId}
        FOR UPDATE
      `,
    );

    if (ownedRows.length !== 1) {
      const currentServiceRequest =
        await transaction.serviceRequest.findUnique({
          where: { id: validatedInput.serviceRequestId },
          select: { id: true, technicianId: true },
        });

      return currentServiceRequest === null
        ? { success: false, code: "SERVICE_REQUEST_NOT_FOUND" }
        : { success: false, code: "NOT_ASSIGNED_TO_TECHNICIAN" };
    }

    const materials = await transaction.serviceTaskMaterial.findMany({
      where: { serviceRequestId: validatedInput.serviceRequestId },
      select: serviceTaskMaterialViewSelect,
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    });

    return {
      success: true,
      materials: materials.map(toServiceTaskMaterialView),
    };
  });
}

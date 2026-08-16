import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { serviceTaskMaterialInputSchema } from "@/lib/technician/service-task-material-input";
import {
  serviceTaskMaterialViewSelect,
  toServiceTaskMaterialView,
  type ServiceTaskMaterialView,
} from "@/lib/technician/service-task-material-view";

export type AddServiceTaskMaterialResult =
  | { success: true; material: ServiceTaskMaterialView }
  | {
      success: false;
      code:
        | "INVALID_INPUT"
        | "SERVICE_REQUEST_NOT_FOUND"
        | "NOT_ASSIGNED_TO_TECHNICIAN"
        | "SERVICE_TASK_TERMINAL";
    };

type OwnershipFailure = Exclude<
  AddServiceTaskMaterialResult,
  { success: true }
>;

async function classifyOwnershipFailure(
  transaction: Prisma.TransactionClient,
  serviceRequestId: string,
  technicianId: string,
): Promise<OwnershipFailure | null> {
  const serviceRequest = await transaction.serviceRequest.findUnique({
    where: { id: serviceRequestId },
    select: { id: true, technicianId: true },
  });

  if (serviceRequest === null) {
    return { success: false, code: "SERVICE_REQUEST_NOT_FOUND" };
  }

  if (serviceRequest.technicianId !== technicianId) {
    return { success: false, code: "NOT_ASSIGNED_TO_TECHNICIAN" };
  }

  return null;
}

async function lockOwnedServiceRequest(
  transaction: Prisma.TransactionClient,
  serviceRequestId: string,
  technicianId: string,
): Promise<{ status: string } | null> {
  const rows = await transaction.$queryRaw<Array<{ status: string }>>(Prisma.sql`
    SELECT "status"
    FROM "service_requests"
    WHERE "id" = ${serviceRequestId}
      AND "technicianId" = ${technicianId}
    FOR UPDATE
  `);

  return rows[0] ?? null;
}

function foreignKeyConstraint(error: Prisma.PrismaClientKnownRequestError) {
  const constraint = error.meta?.constraint ?? error.meta?.field_name;
  return typeof constraint === "string" ? constraint : "";
}

export async function addServiceTaskMaterial(
  input: unknown,
): Promise<AddServiceTaskMaterialResult> {
  const parsed = serviceTaskMaterialInputSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, code: "INVALID_INPUT" };
  }

  const { serviceRequestId, technicianId, name, quantity, unit } = parsed.data;

  try {
    return await prisma.$transaction(async (transaction) => {
      const ownershipFailure = await classifyOwnershipFailure(
        transaction,
        serviceRequestId,
        technicianId,
      );

      if (ownershipFailure !== null) {
        return ownershipFailure;
      }

      const lockedServiceRequest = await lockOwnedServiceRequest(
        transaction,
        serviceRequestId,
        technicianId,
      );

      if (lockedServiceRequest === null) {
        return (
          (await classifyOwnershipFailure(
            transaction,
            serviceRequestId,
            technicianId,
          )) ?? { success: false, code: "NOT_ASSIGNED_TO_TECHNICIAN" }
        );
      }

      if (
        lockedServiceRequest.status === "COMPLETED" ||
        lockedServiceRequest.status === "CANCELLED"
      ) {
        return { success: false, code: "SERVICE_TASK_TERMINAL" };
      }

      const material = await transaction.serviceTaskMaterial.create({
        data: { serviceRequestId, technicianId, name, quantity, unit },
        select: serviceTaskMaterialViewSelect,
      });

      return { success: true, material: toServiceTaskMaterialView(material) };
    });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return { success: false, code: "SERVICE_REQUEST_NOT_FOUND" };
      }

      if (error.code === "P2003") {
        const constraint = foreignKeyConstraint(error);

        if (constraint.includes("serviceRequestId")) {
          return { success: false, code: "SERVICE_REQUEST_NOT_FOUND" };
        }

        if (constraint.includes("technicianId")) {
          return { success: false, code: "NOT_ASSIGNED_TO_TECHNICIAN" };
        }
      }
    }

    throw error;
  }
}

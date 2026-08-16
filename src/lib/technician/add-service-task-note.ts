import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { serviceTaskNoteInputSchema } from "@/lib/technician/service-task-note-input";
import {
  serviceTaskNoteViewSelect,
  type ServiceTaskNoteView,
} from "@/lib/technician/service-task-note-view";

export type AddServiceTaskNoteResult =
  | {
      success: true;
      note: ServiceTaskNoteView;
    }
  | {
      success: false;
      code:
        | "INVALID_INPUT"
        | "SERVICE_REQUEST_NOT_FOUND"
        | "NOT_ASSIGNED_TO_TECHNICIAN"
        | "SERVICE_TASK_TERMINAL";
    };

type OwnershipFailure = Exclude<AddServiceTaskNoteResult, { success: true }>;

async function classifyOwnershipFailure(
  transaction: Prisma.TransactionClient,
  serviceRequestId: string,
  technicianId: string,
): Promise<OwnershipFailure | null> {
  const serviceRequest = await transaction.serviceRequest.findUnique({
    where: { id: serviceRequestId },
    select: {
      id: true,
      technicianId: true,
    },
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

export async function addServiceTaskNote(
  input: unknown,
): Promise<AddServiceTaskNoteResult> {
  const parsed = serviceTaskNoteInputSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, code: "INVALID_INPUT" };
  }

  const { serviceRequestId, technicianId, content } = parsed.data;

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

      const note = await transaction.serviceTaskNote.create({
        data: {
          serviceRequestId,
          technicianId,
          content,
        },
        select: serviceTaskNoteViewSelect,
      });

      return { success: true, note };
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

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  serviceTaskNoteViewSelect,
  type ServiceTaskNoteView,
} from "@/lib/technician/service-task-note-view";
import { z } from "zod";

const listServiceTaskNotesInputSchema = z.object({
  serviceRequestId: z.string().trim().uuid(),
  technicianId: z.string().trim().uuid(),
});

export type ListServiceTaskNotesResult =
  | { success: true; notes: ServiceTaskNoteView[] }
  | {
      success: false;
      code:
        | "INVALID_INPUT"
        | "SERVICE_REQUEST_NOT_FOUND"
        | "NOT_ASSIGNED_TO_TECHNICIAN";
    };

export async function listServiceTaskNotes(
  serviceRequestId: string,
  technicianId: string,
): Promise<ListServiceTaskNotesResult> {
  const parsed = listServiceTaskNotesInputSchema.safeParse({
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
      select: {
        id: true,
        technicianId: true,
      },
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
          select: {
            id: true,
            technicianId: true,
          },
        });

      return currentServiceRequest === null
        ? { success: false, code: "SERVICE_REQUEST_NOT_FOUND" }
        : { success: false, code: "NOT_ASSIGNED_TO_TECHNICIAN" };
    }

    const notes = await transaction.serviceTaskNote.findMany({
      where: {
        serviceRequestId: validatedInput.serviceRequestId,
      },
      select: serviceTaskNoteViewSelect,
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    });

    return { success: true, notes };
  });
}

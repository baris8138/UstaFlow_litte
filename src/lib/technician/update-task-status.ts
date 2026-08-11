import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  serviceRequestViewSelect,
  type ServiceRequestView,
} from "@/lib/service-request/service-request-view";
import { isAllowedTaskStatusTransition } from "@/lib/technician/task-status-transition";
import { z } from "zod";

const updateTaskStatusSchema = z.object({
  serviceRequestId: z.string().trim().uuid(),
  technicianId: z.string().trim().uuid(),
  nextStatus: z.enum(["IN_PROGRESS", "ON_HOLD", "COMPLETED"]),
});

export type UpdateTaskStatusResult =
  | {
      success: true;
      serviceRequest: ServiceRequestView;
    }
  | {
      success: false;
      code:
        | "INVALID_INPUT"
        | "SERVICE_REQUEST_NOT_FOUND"
        | "NOT_ASSIGNED_TO_TECHNICIAN"
        | "INVALID_STATUS_TRANSITION";
    };

export async function updateTaskStatus(
  input: unknown,
): Promise<UpdateTaskStatusResult> {
  const parsed = updateTaskStatusSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, code: "INVALID_INPUT" };
  }

  const { serviceRequestId, technicianId, nextStatus } = parsed.data;

  try {
    const existingServiceRequest = await prisma.serviceRequest.findUnique({
      where: { id: serviceRequestId },
      select: {
        id: true,
        technicianId: true,
        status: true,
      },
    });

    if (existingServiceRequest === null) {
      return { success: false, code: "SERVICE_REQUEST_NOT_FOUND" };
    }

    if (existingServiceRequest.technicianId !== technicianId) {
      return { success: false, code: "NOT_ASSIGNED_TO_TECHNICIAN" };
    }

    let currentStatus = existingServiceRequest.status;

    while (isAllowedTaskStatusTransition(currentStatus, nextStatus)) {
      const updateResult = await prisma.serviceRequest.updateMany({
        where: {
          id: serviceRequestId,
          technicianId,
          status: currentStatus,
        },
        data: {
          status: nextStatus,
        },
      });

      if (updateResult.count > 0) {
        break;
      }

      const currentServiceRequest = await prisma.serviceRequest.findUnique({
        where: { id: serviceRequestId },
        select: {
          id: true,
          technicianId: true,
          status: true,
        },
      });

      if (currentServiceRequest === null) {
        return { success: false, code: "SERVICE_REQUEST_NOT_FOUND" };
      }

      if (currentServiceRequest.technicianId !== technicianId) {
        return { success: false, code: "NOT_ASSIGNED_TO_TECHNICIAN" };
      }

      currentStatus = currentServiceRequest.status;
    }

    if (!isAllowedTaskStatusTransition(currentStatus, nextStatus)) {
      return { success: false, code: "INVALID_STATUS_TRANSITION" };
    }

    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id: serviceRequestId },
      select: serviceRequestViewSelect,
    });

    if (serviceRequest === null) {
      return { success: false, code: "SERVICE_REQUEST_NOT_FOUND" };
    }

    return { success: true, serviceRequest };
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return { success: false, code: "SERVICE_REQUEST_NOT_FOUND" };
    }

    throw error;
  }
}

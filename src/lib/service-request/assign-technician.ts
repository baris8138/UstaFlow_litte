import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { technicianAssignmentSchema } from "@/lib/service-request/technician-assignment-input";
import {
  serviceRequestViewSelect,
  type ServiceRequestView,
} from "@/lib/service-request/service-request-view";

export type AssignTechnicianResult =
  | {
      success: true;
      serviceRequest: ServiceRequestView;
    }
  | {
      success: false;
      code:
        | "INVALID_INPUT"
        | "SERVICE_REQUEST_NOT_FOUND"
        | "TECHNICIAN_NOT_FOUND"
        | "TECHNICIAN_INACTIVE"
        | "USER_NOT_TECHNICIAN";
    };

function metadataMentionsTechnicianRelation(value: unknown): boolean {
  if (typeof value === "string") {
    const normalized = value.toLowerCase().replace(/[^a-z0-9]+/g, "");

    return normalized.includes("technicianid");
  }

  if (Array.isArray(value)) {
    return value.some(metadataMentionsTechnicianRelation);
  }

  if (value !== null && typeof value === "object") {
    return Object.values(value).some(metadataMentionsTechnicianRelation);
  }

  return false;
}

export async function assignTechnician(
  input: unknown,
): Promise<AssignTechnicianResult> {
  const parsed = technicianAssignmentSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, code: "INVALID_INPUT" };
  }

  const { serviceRequestId, technicianId } = parsed.data;
  const existingServiceRequest = await prisma.serviceRequest.findUnique({
    where: { id: serviceRequestId },
    select: {
      id: true,
      status: true,
      technicianId: true,
    },
  });

  if (existingServiceRequest === null) {
    return { success: false, code: "SERVICE_REQUEST_NOT_FOUND" };
  }

  if (technicianId !== null) {
    const technician = await prisma.user.findUnique({
      where: { id: technicianId },
      select: {
        id: true,
        role: true,
        isActive: true,
      },
    });

    if (technician === null) {
      return { success: false, code: "TECHNICIAN_NOT_FOUND" };
    }

    if (technician.role !== "TECHNICIAN") {
      return { success: false, code: "USER_NOT_TECHNICIAN" };
    }

    if (!technician.isActive) {
      return { success: false, code: "TECHNICIAN_INACTIVE" };
    }
  }

  const shouldSetAssignedStatus =
    technicianId !== null &&
    (existingServiceRequest.status === "OPEN" ||
      existingServiceRequest.status === "ASSIGNED");
  const shouldSetOpenStatus =
    technicianId === null &&
    (existingServiceRequest.status === "OPEN" ||
      existingServiceRequest.status === "ASSIGNED");

  try {
    const serviceRequest: ServiceRequestView =
      await prisma.serviceRequest.update({
        where: { id: serviceRequestId },
        data: shouldSetAssignedStatus
          ? { technicianId, status: "ASSIGNED" }
          : shouldSetOpenStatus
            ? { technicianId, status: "OPEN" }
            : { technicianId },
        select: serviceRequestViewSelect,
      });

    return { success: true, serviceRequest };
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return { success: false, code: "SERVICE_REQUEST_NOT_FOUND" };
    }

    if (
      technicianId !== null &&
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003" &&
      metadataMentionsTechnicianRelation(error.meta)
    ) {
      return { success: false, code: "TECHNICIAN_NOT_FOUND" };
    }

    throw error;
  }
}

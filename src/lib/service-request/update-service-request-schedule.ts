import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { serviceRequestScheduleSchema } from "@/lib/service-request/service-request-schedule-input";

export type UpdateServiceRequestScheduleResult =
  | {
      success: true;
      serviceRequest: {
        id: string;
        plannedAt: Date | null;
        updatedAt: Date;
      };
    }
  | {
      success: false;
      code:
        | "INVALID_INPUT"
        | "SERVICE_REQUEST_NOT_FOUND"
        | "SERVICE_REQUEST_TERMINAL";
    };

export async function updateServiceRequestSchedule(
  input: unknown,
): Promise<UpdateServiceRequestScheduleResult> {
  const parsed = serviceRequestScheduleSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, code: "INVALID_INPUT" };
  }

  const { serviceRequestId, plannedAt } = parsed.data;

  try {
    return await prisma.$transaction(async (transaction) => {
      const serviceRequestRows = await transaction.$queryRaw<
        Array<{ id: string; status: string }>
      >(Prisma.sql`
        SELECT "id", "status"
        FROM "service_requests"
        WHERE "id" = ${serviceRequestId}
        FOR UPDATE
      `);
      const existingServiceRequest = serviceRequestRows[0];

      if (existingServiceRequest === undefined) {
        return { success: false, code: "SERVICE_REQUEST_NOT_FOUND" };
      }

      if (
        existingServiceRequest.status === "COMPLETED" ||
        existingServiceRequest.status === "CANCELLED"
      ) {
        return { success: false, code: "SERVICE_REQUEST_TERMINAL" };
      }

      const serviceRequest = await transaction.serviceRequest.update({
        where: { id: serviceRequestId },
        data: { scheduledAt: plannedAt },
        select: {
          id: true,
          scheduledAt: true,
          updatedAt: true,
        },
      });

      return {
        success: true,
        serviceRequest: {
          id: serviceRequest.id,
          plannedAt: serviceRequest.scheduledAt,
          updatedAt: serviceRequest.updatedAt,
        },
      };
    });
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

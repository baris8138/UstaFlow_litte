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
      code: "INVALID_INPUT" | "SERVICE_REQUEST_NOT_FOUND";
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
    const serviceRequest = await prisma.serviceRequest.update({
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

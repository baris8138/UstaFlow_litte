import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { serviceRequestCreateSchema } from "@/lib/service-request/service-request-input";
import {
  serviceRequestViewSelect,
  type ServiceRequestView,
} from "@/lib/service-request/service-request-view";

export type CreateServiceRequestResult =
  | {
      success: true;
      serviceRequest: ServiceRequestView;
    }
  | {
      success: false;
      code: "INVALID_INPUT" | "CUSTOMER_NOT_FOUND" | "CUSTOMER_INACTIVE";
    };

export async function createServiceRequest(
  input: unknown,
): Promise<CreateServiceRequestResult> {
  const parsed = serviceRequestCreateSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, code: "INVALID_INPUT" };
  }

  const data = parsed.data;
  const customer = await prisma.customer.findUnique({
    where: { id: data.customerId },
    select: { id: true, isActive: true },
  });

  if (customer === null) {
    return { success: false, code: "CUSTOMER_NOT_FOUND" };
  }

  if (!customer.isActive) {
    return { success: false, code: "CUSTOMER_INACTIVE" };
  }

  try {
    const serviceRequest: ServiceRequestView =
      await prisma.serviceRequest.create({
        data: {
          customerId: data.customerId,
          title: data.title,
          description: data.description,
          priority: data.priority,
          scheduledAt: data.scheduledAt,
        },
        select: serviceRequestViewSelect,
      });

    return { success: true, serviceRequest };
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return { success: false, code: "CUSTOMER_NOT_FOUND" };
    }

    throw error;
  }
}

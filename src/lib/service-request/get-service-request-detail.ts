import { prisma } from "@/lib/prisma";
import {
  serviceRequestDetailSelect,
  toServiceRequestDetailView,
  type ServiceRequestDetailView,
} from "@/lib/service-request/service-request-detail-view";
import { z } from "zod";

const serviceRequestIdSchema = z.string().trim().uuid();

export type GetServiceRequestDetailResult =
  | {
      success: true;
      serviceRequest: ServiceRequestDetailView;
    }
  | {
      success: false;
      code: "INVALID_INPUT" | "SERVICE_REQUEST_NOT_FOUND";
    };

export async function getServiceRequestDetail(
  serviceRequestId: string,
): Promise<GetServiceRequestDetailResult> {
  const parsed = serviceRequestIdSchema.safeParse(serviceRequestId);

  if (!parsed.success) {
    return { success: false, code: "INVALID_INPUT" };
  }

  const serviceRequest = await prisma.serviceRequest.findUnique({
    where: { id: parsed.data },
    select: serviceRequestDetailSelect,
  });

  if (serviceRequest === null) {
    return { success: false, code: "SERVICE_REQUEST_NOT_FOUND" };
  }

  return {
    success: true,
    serviceRequest: toServiceRequestDetailView(serviceRequest),
  };
}

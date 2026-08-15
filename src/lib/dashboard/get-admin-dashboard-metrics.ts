import {
  ServiceRequestStatus,
  UserRole,
} from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export type AdminDashboardMetrics = {
  openRequests: number;
  assignedRequests: number;
  inProgressRequests: number;
  onHoldRequests: number;
  completedRequests: number;
  unassignedRequests: number;
  activeTechnicians: number;
  upcomingScheduledRequests: number;
};

export async function getAdminDashboardMetrics(): Promise<AdminDashboardMetrics> {
  const now = new Date();

  const [
    openRequests,
    assignedRequests,
    inProgressRequests,
    onHoldRequests,
    completedRequests,
    unassignedRequests,
    activeTechnicians,
    upcomingScheduledRequests,
  ] = await prisma.$transaction([
    prisma.serviceRequest.count({
      where: { status: ServiceRequestStatus.OPEN },
    }),
    prisma.serviceRequest.count({
      where: { status: ServiceRequestStatus.ASSIGNED },
    }),
    prisma.serviceRequest.count({
      where: { status: ServiceRequestStatus.IN_PROGRESS },
    }),
    prisma.serviceRequest.count({
      where: { status: ServiceRequestStatus.ON_HOLD },
    }),
    prisma.serviceRequest.count({
      where: { status: ServiceRequestStatus.COMPLETED },
    }),
    prisma.serviceRequest.count({
      where: { technicianId: null },
    }),
    prisma.user.count({
      where: {
        role: UserRole.TECHNICIAN,
        isActive: true,
      },
    }),
    prisma.serviceRequest.count({
      where: {
        scheduledAt: {
          not: null,
          gte: now,
        },
        status: {
          notIn: [
            ServiceRequestStatus.COMPLETED,
            ServiceRequestStatus.CANCELLED,
          ],
        },
      },
    }),
  ]);

  return {
    openRequests,
    assignedRequests,
    inProgressRequests,
    onHoldRequests,
    completedRequests,
    unassignedRequests,
    activeTechnicians,
    upcomingScheduledRequests,
  };
}

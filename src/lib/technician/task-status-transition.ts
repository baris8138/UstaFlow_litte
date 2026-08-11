import type { ServiceRequestStatus } from "@/generated/prisma/client";

const allowedTaskStatusTransitions = {
  OPEN: [],
  ASSIGNED: ["IN_PROGRESS"],
  IN_PROGRESS: ["ON_HOLD", "COMPLETED"],
  ON_HOLD: ["IN_PROGRESS", "COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
} as const satisfies Record<
  ServiceRequestStatus,
  readonly ServiceRequestStatus[]
>;

export function isAllowedTaskStatusTransition(
  currentStatus: ServiceRequestStatus,
  nextStatus: ServiceRequestStatus,
): boolean {
  const allowedNextStatuses: readonly ServiceRequestStatus[] =
    allowedTaskStatusTransitions[currentStatus];

  return allowedNextStatuses.includes(nextStatus);
}

import type {
  CustomerType,
  Prisma,
  ServiceMaterialUnit,
  ServiceRequestPriority,
  ServiceRequestStatus,
} from "@/generated/prisma/client";

export type ServiceRequestDetailView = {
  id: string;
  title: string;
  description: string;
  status: ServiceRequestStatus;
  priority: ServiceRequestPriority;
  plannedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  customer: {
    id: string;
    name: string;
    type: CustomerType;
    email: string | null;
    phone: string | null;
    addressLine: string | null;
    city: string | null;
    district: string | null;
    isActive: boolean;
  };
  technician: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isActive: boolean;
  } | null;
  notes: Array<{
    id: string;
    content: string;
    createdAt: Date;
    technician: {
      id: string;
      firstName: string;
      lastName: string;
    };
  }>;
  materials: Array<{
    id: string;
    name: string;
    quantity: string;
    unit: ServiceMaterialUnit;
    createdAt: Date;
    technician: {
      id: string;
      firstName: string;
      lastName: string;
    };
  }>;
};

export const serviceRequestDetailSelect = {
  id: true,
  title: true,
  description: true,
  status: true,
  priority: true,
  scheduledAt: true,
  createdAt: true,
  updatedAt: true,
  customer: {
    select: {
      id: true,
      name: true,
      type: true,
      email: true,
      phone: true,
      addressLine: true,
      city: true,
      district: true,
      isActive: true,
    },
  },
  technician: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      isActive: true,
    },
  },
  notes: {
    select: {
      id: true,
      content: true,
      createdAt: true,
      technician: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
  },
  materials: {
    select: {
      id: true,
      name: true,
      quantity: true,
      unit: true,
      createdAt: true,
      technician: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
  },
} satisfies Prisma.ServiceRequestSelect;

type SelectedServiceRequestDetail = Prisma.ServiceRequestGetPayload<{
  select: typeof serviceRequestDetailSelect;
}>;

export function toServiceRequestDetailView(
  serviceRequest: SelectedServiceRequestDetail,
): ServiceRequestDetailView {
  const { scheduledAt, materials, ...detail } = serviceRequest;

  return {
    ...detail,
    plannedAt: scheduledAt,
    materials: materials.map((material) => ({
      ...material,
      quantity: material.quantity.toString(),
    })),
  };
}

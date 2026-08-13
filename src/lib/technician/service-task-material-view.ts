import type { Prisma, ServiceMaterialUnit } from "@/generated/prisma/client";

export type ServiceTaskMaterialView = {
  id: string;
  serviceRequestId: string;
  name: string;
  quantity: string;
  unit: ServiceMaterialUnit;
  createdAt: Date;
  technician: {
    id: string;
    firstName: string;
    lastName: string;
  };
};

export const serviceTaskMaterialViewSelect = {
  id: true,
  serviceRequestId: true,
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
} satisfies Prisma.ServiceTaskMaterialSelect;

type SelectedServiceTaskMaterial = Prisma.ServiceTaskMaterialGetPayload<{
  select: typeof serviceTaskMaterialViewSelect;
}>;

export function toServiceTaskMaterialView(
  material: SelectedServiceTaskMaterial,
): ServiceTaskMaterialView {
  return {
    ...material,
    quantity: material.quantity.toString(),
  };
}

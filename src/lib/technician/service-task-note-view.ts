import type { Prisma } from "@/generated/prisma/client";

export type ServiceTaskNoteView = {
  id: string;
  serviceRequestId: string;
  content: string;
  createdAt: Date;
  technician: {
    id: string;
    firstName: string;
    lastName: string;
  };
};

export const serviceTaskNoteViewSelect = {
  id: true,
  serviceRequestId: true,
  content: true,
  createdAt: true,
  technician: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  },
} satisfies Prisma.ServiceTaskNoteSelect;

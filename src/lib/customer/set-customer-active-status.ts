import { Prisma } from "@/generated/prisma/client";
import {
  customerViewSelect,
  type CustomerView,
} from "@/lib/customer/customer-view";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const setCustomerActiveStatusSchema = z.object({
  id: z.string().trim().uuid(),
  isActive: z.boolean(),
});

export type SetCustomerActiveStatusResult =
  | {
      success: true;
      customer: CustomerView;
    }
  | {
      success: false;
      code: "INVALID_INPUT" | "NOT_FOUND";
    };

export async function setCustomerActiveStatus(
  input: unknown,
): Promise<SetCustomerActiveStatusResult> {
  const parsed = setCustomerActiveStatusSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, code: "INVALID_INPUT" };
  }

  const { id, isActive } = parsed.data;
  const existingCustomer = await prisma.customer.findUnique({
    where: { id },
    select: { id: true },
  });

  if (existingCustomer === null) {
    return { success: false, code: "NOT_FOUND" };
  }

  try {
    const customer: CustomerView = await prisma.customer.update({
      where: { id },
      data: { isActive },
      select: customerViewSelect,
    });

    return { success: true, customer };
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return { success: false, code: "NOT_FOUND" };
    }

    throw error;
  }
}

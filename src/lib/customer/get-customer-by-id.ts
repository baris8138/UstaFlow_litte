import {
  customerViewSelect,
  type CustomerView,
} from "@/lib/customer/customer-view";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const customerIdSchema = z.string().trim().uuid();

export type GetCustomerByIdResult =
  | {
      success: true;
      customer: CustomerView;
    }
  | {
      success: false;
      code: "INVALID_ID" | "NOT_FOUND";
    };

export async function getCustomerById(
  input: unknown,
): Promise<GetCustomerByIdResult> {
  const parsed = customerIdSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, code: "INVALID_ID" };
  }

  const customer: CustomerView | null = await prisma.customer.findUnique({
    where: { id: parsed.data },
    select: customerViewSelect,
  });

  if (customer === null) {
    return { success: false, code: "NOT_FOUND" };
  }

  return { success: true, customer };
}

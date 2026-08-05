import { Prisma } from "@/generated/prisma/client";
import { customerUpdateSchema } from "@/lib/customer/customer-update-input";
import {
  customerViewSelect,
  type CustomerView,
} from "@/lib/customer/customer-view";
import { prisma } from "@/lib/prisma";

export type UpdateCustomerResult =
  | {
      success: true;
      customer: CustomerView;
    }
  | {
      success: false;
      code:
        | "INVALID_INPUT"
        | "NOT_FOUND"
        | "DUPLICATE_EMAIL"
        | "DUPLICATE_PHONE";
    };

function metadataMentionsField(value: unknown, field: string): boolean {
  if (typeof value === "string") {
    return value.toLowerCase().split(/[^a-z0-9]+/).includes(field);
  }

  if (Array.isArray(value)) {
    return value.some((item) => metadataMentionsField(item, field));
  }

  if (value !== null && typeof value === "object") {
    return Object.values(value).some((item) =>
      metadataMentionsField(item, field),
    );
  }

  return false;
}

export async function updateCustomer(
  input: unknown,
): Promise<UpdateCustomerResult> {
  const parsed = customerUpdateSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, code: "INVALID_INPUT" };
  }

  const { id, ...data } = parsed.data;
  const existingCustomer = await prisma.customer.findUnique({
    where: { id },
    select: { id: true },
  });

  if (existingCustomer === null) {
    return { success: false, code: "NOT_FOUND" };
  }

  if (data.email !== null) {
    const duplicateEmail = await prisma.customer.findFirst({
      where: {
        email: data.email,
        id: { not: id },
      },
      select: { id: true },
    });

    if (duplicateEmail !== null) {
      return { success: false, code: "DUPLICATE_EMAIL" };
    }
  }

  if (data.phone !== null) {
    const duplicatePhone = await prisma.customer.findFirst({
      where: {
        phone: data.phone,
        id: { not: id },
      },
      select: { id: true },
    });

    if (duplicatePhone !== null) {
      return { success: false, code: "DUPLICATE_PHONE" };
    }
  }

  try {
    const customer: CustomerView = await prisma.customer.update({
      where: { id },
      data: {
        name: data.name,
        type: data.type,
        phone: data.phone,
        email: data.email,
        addressLine: data.addressLine,
        city: data.city,
        district: data.district,
        postalCode: data.postalCode,
      },
      select: customerViewSelect,
    });

    return { success: true, customer };
  } catch (error: unknown) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
      throw error;
    }

    if (error.code === "P2025") {
      return { success: false, code: "NOT_FOUND" };
    }

    if (error.code !== "P2002") {
      throw error;
    }

    if (metadataMentionsField(error.meta, "email")) {
      return { success: false, code: "DUPLICATE_EMAIL" };
    }

    if (metadataMentionsField(error.meta, "phone")) {
      return { success: false, code: "DUPLICATE_PHONE" };
    }

    throw error;
  }
}

import { Prisma } from "@/generated/prisma/client";
import { customerCreateSchema } from "@/lib/customer/customer-input";
import { prisma } from "@/lib/prisma";

export type CustomerView = {
  id: string;
  name: string;
  type: "INDIVIDUAL" | "CORPORATE";
  phone: string | null;
  email: string | null;
  addressLine: string | null;
  city: string | null;
  district: string | null;
  postalCode: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateCustomerResult =
  | {
      success: true;
      customer: CustomerView;
    }
  | {
      success: false;
      code: "INVALID_INPUT" | "DUPLICATE_EMAIL" | "DUPLICATE_PHONE";
    };

const customerViewSelect = {
  id: true,
  name: true,
  type: true,
  phone: true,
  email: true,
  addressLine: true,
  city: true,
  district: true,
  postalCode: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
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

export async function createCustomer(
  input: unknown,
): Promise<CreateCustomerResult> {
  const parsed = customerCreateSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, code: "INVALID_INPUT" };
  }

  const data = parsed.data;

  if (data.email !== null) {
    const duplicateEmail = await prisma.customer.findFirst({
      where: { email: data.email },
      select: { id: true },
    });

    if (duplicateEmail !== null) {
      return { success: false, code: "DUPLICATE_EMAIL" };
    }
  }

  if (data.phone !== null) {
    const duplicatePhone = await prisma.customer.findFirst({
      where: { phone: data.phone },
      select: { id: true },
    });

    if (duplicatePhone !== null) {
      return { success: false, code: "DUPLICATE_PHONE" };
    }
  }

  try {
    const customer: CustomerView = await prisma.customer.create({
      data,
      select: customerViewSelect,
    });

    return { success: true, customer };
  } catch (error: unknown) {
    if (
      !(error instanceof Prisma.PrismaClientKnownRequestError) ||
      error.code !== "P2002"
    ) {
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

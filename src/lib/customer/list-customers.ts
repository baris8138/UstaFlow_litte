import {
  customerViewSelect,
  type CustomerView,
} from "@/lib/customer/customer-view";
import { prisma } from "@/lib/prisma";

export type ListCustomersOptions = {
  activeOnly?: boolean;
};

export async function listCustomers(
  options: ListCustomersOptions = {},
): Promise<CustomerView[]> {
  return prisma.customer.findMany({
    ...(options.activeOnly === true
      ? { where: { isActive: true } }
      : {}),
    select: customerViewSelect,
    orderBy: [{ createdAt: "desc" }, { name: "asc" }],
  });
}

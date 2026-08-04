"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/access-control";
import { createCustomer } from "@/lib/customer/create-customer";

import type { CustomerFormState } from "./customer-form-state";

export async function createCustomerAction(
  previousState: CustomerFormState,
  formData: FormData,
): Promise<CustomerFormState> {
  void previousState;
  await requireRole(["ADMIN"]);

  const result = await createCustomer({
    name: formData.get("name"),
    type: formData.get("type"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    addressLine: formData.get("addressLine"),
    city: formData.get("city"),
    district: formData.get("district"),
    postalCode: formData.get("postalCode"),
  });

  if (!result.success) {
    const messages = {
      INVALID_INPUT: "Lütfen müşteri bilgilerini kontrol edin.",
      DUPLICATE_EMAIL:
        "Bu e-posta adresiyle kayıtlı bir müşteri zaten var.",
      DUPLICATE_PHONE:
        "Bu telefon numarasıyla kayıtlı bir müşteri zaten var.",
    };

    return { status: "error", message: messages[result.code] };
  }

  revalidatePath("/customers");

  return {
    status: "success",
    message: "Müşteri başarıyla oluşturuldu.",
  };
}

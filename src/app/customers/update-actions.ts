"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/access-control";
import { setCustomerActiveStatus } from "@/lib/customer/set-customer-active-status";
import { updateCustomer } from "@/lib/customer/update-customer";

import type {
  CustomerStatusActionState,
  CustomerUpdateFormState,
} from "./customer-update-form-state";

export async function updateCustomerAction(
  previousState: CustomerUpdateFormState,
  formData: FormData,
): Promise<CustomerUpdateFormState> {
  void previousState;
  await requireRole(["ADMIN"]);

  const result = await updateCustomer({
    id: formData.get("id"),
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
      NOT_FOUND: "Güncellenmek istenen müşteri bulunamadı.",
      DUPLICATE_EMAIL:
        "Bu e-posta adresi başka bir müşteri tarafından kullanılıyor.",
      DUPLICATE_PHONE:
        "Bu telefon numarası başka bir müşteri tarafından kullanılıyor.",
    };

    return { status: "error", message: messages[result.code] };
  }

  revalidatePath("/customers");
  revalidatePath(`/customers/${result.customer.id}/edit`);

  return {
    status: "success",
    message: "Müşteri bilgileri başarıyla güncellendi.",
  };
}

export async function setCustomerActiveStatusAction(
  previousState: CustomerStatusActionState,
  formData: FormData,
): Promise<CustomerStatusActionState> {
  void previousState;
  await requireRole(["ADMIN"]);

  const isActiveValue = formData.get("isActive");
  const isActive =
    isActiveValue === "true"
      ? true
      : isActiveValue === "false"
        ? false
        : isActiveValue;
  const result = await setCustomerActiveStatus({
    id: formData.get("id"),
    isActive,
  });

  if (!result.success) {
    const messages = {
      INVALID_INPUT: "Durum değiştirme bilgileri geçersiz.",
      NOT_FOUND: "Durumu değiştirilmek istenen müşteri bulunamadı.",
    };

    return { status: "error", message: messages[result.code] };
  }

  revalidatePath("/customers");
  revalidatePath(`/customers/${result.customer.id}/edit`);

  return {
    status: "success",
    message: result.customer.isActive
      ? "Müşteri yeniden aktif hâle getirildi."
      : "Müşteri pasif hâle getirildi.",
  };
}

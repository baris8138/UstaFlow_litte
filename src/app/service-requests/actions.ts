"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/access-control";
import { createServiceRequest } from "@/lib/service-request/create-service-request";

import type { ServiceRequestFormState } from "./service-request-form-state";

export async function createServiceRequestAction(
  previousState: ServiceRequestFormState,
  formData: FormData,
): Promise<ServiceRequestFormState> {
  void previousState;
  await requireRole(["ADMIN"]);

  const result = await createServiceRequest({
    customerId: formData.get("customerId"),
    title: formData.get("title"),
    description: formData.get("description"),
    priority: formData.get("priority"),
    scheduledAt: formData.get("scheduledAt"),
  });

  if (!result.success) {
    const messages = {
      INVALID_INPUT: "Lütfen servis talebi bilgilerini kontrol edin.",
      CUSTOMER_NOT_FOUND: "Seçilen müşteri bulunamadı.",
      CUSTOMER_INACTIVE:
        "Pasif müşteriler için yeni servis talebi oluşturulamaz.",
    };

    return { status: "error", message: messages[result.code] };
  }

  revalidatePath("/service-requests");

  return {
    status: "success",
    message: "Servis talebi başarıyla oluşturuldu.",
  };
}

"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/access-control";
import { assignTechnician } from "@/lib/service-request/assign-technician";
import { createServiceRequest } from "@/lib/service-request/create-service-request";

import type { ServiceRequestFormState } from "./service-request-form-state";
import type { TechnicianAssignmentState } from "./technician-assignment-state";

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

export async function assignTechnicianAction(
  previousState: TechnicianAssignmentState,
  formData: FormData,
): Promise<TechnicianAssignmentState> {
  void previousState;
  await requireRole(["ADMIN"]);

  const technicianIdValue = formData.get("technicianId");
  const technicianId =
    technicianIdValue === "" ? null : technicianIdValue;
  const result = await assignTechnician({
    serviceRequestId: formData.get("serviceRequestId"),
    technicianId,
  });

  if (!result.success) {
    const messages = {
      INVALID_INPUT: "Teknisyen atama bilgileri geçersiz.",
      SERVICE_REQUEST_NOT_FOUND: "Servis talebi bulunamadı.",
      TECHNICIAN_NOT_FOUND: "Seçilen teknisyen bulunamadı.",
      TECHNICIAN_INACTIVE: "Pasif teknisyen atanamaz.",
      USER_NOT_TECHNICIAN: "Seçilen kullanıcı teknisyen rolünde değil.",
    };

    return { status: "error", message: messages[result.code] };
  }

  revalidatePath("/service-requests");

  return {
    status: "success",
    message:
      technicianId === null
        ? "Teknisyen ataması kaldırıldı."
        : "Teknisyen başarıyla atandı.",
  };
}

"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/access-control";
import { updateServiceRequestSchedule } from "@/lib/service-request/update-service-request-schedule";

export type UpdateScheduleActionResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      code:
        | "INVALID_INPUT"
        | "SERVICE_REQUEST_NOT_FOUND"
        | "SERVER_ERROR";
      message: string;
    };

export async function updateServiceRequestScheduleAction(
  formData: FormData,
): Promise<UpdateScheduleActionResult> {
  await requireRole(["ADMIN"]);

  const intent = formData.get("intent");

  if (intent !== "save" && intent !== "clear") {
    return {
      success: false,
      code: "INVALID_INPUT",
      message: "Planlama bilgileri geçersiz.",
    };
  }

  const serviceRequestId = formData.get("serviceRequestId");
  const plannedAt =
    intent === "clear" ? null : formData.get("plannedAt");

  try {
    const result = await updateServiceRequestSchedule({
      serviceRequestId,
      plannedAt,
    });

    if (!result.success) {
      const messages = {
        INVALID_INPUT: "Planlama bilgileri geçersiz.",
        SERVICE_REQUEST_NOT_FOUND: "Servis talebi bulunamadı.",
      };

      return {
        success: false,
        code: result.code,
        message: messages[result.code],
      };
    }

    revalidatePath(`/service-requests/${serviceRequestId}`);
    revalidatePath("/service-requests");

    return {
      success: true,
      message:
        intent === "clear"
          ? "Servis planlaması kaldırıldı."
          : "Planlanan servis tarihi güncellendi.",
    };
  } catch {
    return {
      success: false,
      code: "SERVER_ERROR",
      message: "Planlama güncellenirken bir hata oluştu.",
    };
  }
}

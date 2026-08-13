"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/access-control";
import { addServiceTaskMaterial } from "@/lib/technician/add-service-task-material";
import { addServiceTaskNote } from "@/lib/technician/add-service-task-note";
import { updateTaskStatus } from "@/lib/technician/update-task-status";

import type { TaskMaterialState } from "./task-material-state";
import type { TaskNoteState } from "./task-note-state";
import type { TaskStatusState } from "./task-status-state";

export async function addServiceTaskMaterialAction(
  previousState: TaskMaterialState,
  formData: FormData,
): Promise<TaskMaterialState> {
  void previousState;
  const currentUser = await requireRole(["TECHNICIAN"]);
  const result = await addServiceTaskMaterial({
    serviceRequestId: formData.get("serviceRequestId"),
    technicianId: currentUser.id,
    name: formData.get("name"),
    quantity: formData.get("quantity"),
    unit: formData.get("unit"),
  });

  if (!result.success) {
    const messages = {
      INVALID_INPUT: "Malzeme bilgileri geçersiz.",
      SERVICE_REQUEST_NOT_FOUND: "Servis talebi bulunamadı.",
      NOT_ASSIGNED_TO_TECHNICIAN: "Bu servis talebi size atanmış değil.",
    };

    return { status: "error", message: messages[result.code] };
  }

  revalidatePath("/my-tasks");

  return {
    status: "success",
    message: "Kullanılan malzeme başarıyla kaydedildi.",
  };
}

export async function addServiceTaskNoteAction(
  previousState: TaskNoteState,
  formData: FormData,
): Promise<TaskNoteState> {
  void previousState;
  const currentUser = await requireRole(["TECHNICIAN"]);
  const result = await addServiceTaskNote({
    serviceRequestId: formData.get("serviceRequestId"),
    technicianId: currentUser.id,
    content: formData.get("content"),
  });

  if (!result.success) {
    const messages = {
      INVALID_INPUT: "Çalışma notu bilgileri geçersiz.",
      SERVICE_REQUEST_NOT_FOUND: "Servis talebi bulunamadı.",
      NOT_ASSIGNED_TO_TECHNICIAN: "Bu servis talebi size atanmış değil.",
    };

    return { status: "error", message: messages[result.code] };
  }

  revalidatePath("/my-tasks");

  return {
    status: "success",
    message: "Çalışma notu başarıyla eklendi.",
  };
}

export async function updateTaskStatusAction(
  previousState: TaskStatusState,
  formData: FormData,
): Promise<TaskStatusState> {
  void previousState;
  const currentUser = await requireRole(["TECHNICIAN"]);
  const result = await updateTaskStatus({
    serviceRequestId: formData.get("serviceRequestId"),
    technicianId: currentUser.id,
    nextStatus: formData.get("nextStatus"),
  });

  if (!result.success) {
    const messages = {
      INVALID_INPUT: "Görev durumu bilgileri geçersiz.",
      SERVICE_REQUEST_NOT_FOUND: "Servis talebi bulunamadı.",
      NOT_ASSIGNED_TO_TECHNICIAN: "Bu servis talebi size atanmış değil.",
      INVALID_STATUS_TRANSITION: "Bu durum geçişine izin verilmiyor.",
    };

    return { status: "error", message: messages[result.code] };
  }

  revalidatePath("/my-tasks");

  return {
    status: "success",
    message: "Görev durumu başarıyla güncellendi.",
  };
}

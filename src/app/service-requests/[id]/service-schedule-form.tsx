"use client";

import { useActionState, useEffect, useRef } from "react";

import {
  updateServiceRequestScheduleAction,
  type UpdateScheduleActionResult,
} from "./actions";
import styles from "./service-request-detail.module.css";

type ServiceScheduleFormProps = {
  serviceRequestId: string;
  currentPlannedAt: string | null;
};

const initialState: UpdateScheduleActionResult | null = null;

function padDatePart(value: number) {
  return String(value).padStart(2, "0");
}

function toLocalDateTimeValue(isoDate: string) {
  const date = new Date(isoDate);

  return [
    date.getFullYear(),
    "-",
    padDatePart(date.getMonth() + 1),
    "-",
    padDatePart(date.getDate()),
    "T",
    padDatePart(date.getHours()),
    ":",
    padDatePart(date.getMinutes()),
  ].join("");
}

export function ServiceScheduleForm({
  serviceRequestId,
  currentPlannedAt,
}: ServiceScheduleFormProps) {
  const plannedAtInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (plannedAtInputRef.current) {
      plannedAtInputRef.current.value = currentPlannedAt
        ? toLocalDateTimeValue(currentPlannedAt)
        : "";
    }
  }, [currentPlannedAt]);

  const submitAction = async (
    _previousState: UpdateScheduleActionResult | null,
    formData: FormData,
  ): Promise<UpdateScheduleActionResult> => {
    const intent = formData.get("intent");

    if (intent === "save") {
      const localValue = formData.get("plannedAtLocal");

      if (typeof localValue !== "string" || localValue.trim() === "") {
        return {
          success: false,
          code: "INVALID_INPUT",
          message: "Lütfen tarih ve saat seçin.",
        };
      }

      const plannedAt = new Date(localValue);

      if (Number.isNaN(plannedAt.getTime())) {
        return {
          success: false,
          code: "INVALID_INPUT",
          message: "Lütfen geçerli bir tarih ve saat seçin.",
        };
      }

      formData.set("plannedAt", plannedAt.toISOString());
    }

    formData.delete("plannedAtLocal");

    return updateServiceRequestScheduleAction(formData);
  };
  const [state, formAction, isPending] = useActionState(
    submitAction,
    initialState,
  );

  return (
    <form action={formAction} className={styles.scheduleForm}>
      <input name="serviceRequestId" type="hidden" value={serviceRequestId} />
      <label className={styles.scheduleField}>
        <span>Planlanan servis tarihi</span>
        <input
          disabled={isPending}
          name="plannedAtLocal"
          ref={plannedAtInputRef}
          type="datetime-local"
        />
      </label>
      <div className={styles.scheduleActions}>
        <button disabled={isPending} name="intent" type="submit" value="save">
          {isPending ? "İşleniyor..." : "Planlamayı Kaydet"}
        </button>
        {currentPlannedAt ? (
          <button
            className={styles.clearScheduleButton}
            disabled={isPending}
            name="intent"
            type="submit"
            value="clear"
          >
            {isPending ? "İşleniyor..." : "Planlamayı Kaldır"}
          </button>
        ) : null}
      </div>
      {state ? (
        <p
          aria-live="polite"
          className={state.success ? styles.scheduleSuccess : styles.scheduleError}
          role={state.success ? "status" : "alert"}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

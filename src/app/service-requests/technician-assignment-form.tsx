"use client";

import { useActionState } from "react";

import { assignTechnicianAction } from "./actions";
import styles from "./service-requests.module.css";
import { initialTechnicianAssignmentState } from "./technician-assignment-state";

type TechnicianAssignmentFormProps = {
  serviceRequestId: string;
  currentTechnicianId: string | null;
  technicians: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }>;
};

export function TechnicianAssignmentForm({
  serviceRequestId,
  currentTechnicianId,
  technicians,
}: TechnicianAssignmentFormProps) {
  const [state, formAction, isPending] = useActionState(
    assignTechnicianAction,
    initialTechnicianAssignmentState,
  );

  return (
    <form action={formAction} className={styles.assignmentForm}>
      <input name="serviceRequestId" type="hidden" value={serviceRequestId} />
      <label>
        <span className={styles.visuallyHidden}>Teknisyen seçin</span>
        <select
          name="technicianId"
          defaultValue={currentTechnicianId ?? ""}
          disabled={isPending}
        >
          <option value="">Teknisyen atanmadı</option>
          {technicians.map((technician) => (
            <option key={technician.id} value={technician.id}>
              {technician.firstName} {technician.lastName} — {technician.email}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" disabled={isPending}>
        {isPending ? "Kaydediliyor..." : "Atamayı kaydet"}
      </button>

      {state.status === "success" && state.message ? (
        <p className={styles.assignmentSuccess} role="status">
          {state.message}
        </p>
      ) : null}
      {state.status === "error" && state.message ? (
        <p className={styles.assignmentError} role="alert">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

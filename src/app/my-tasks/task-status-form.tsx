"use client";

import { useActionState, useState } from "react";

import { updateTaskStatusAction } from "./actions";
import styles from "./my-tasks.module.css";
import { initialTaskStatusState } from "./task-status-state";

type TaskStatus =
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "ON_HOLD"
  | "COMPLETED"
  | "OPEN"
  | "CANCELLED";

type NextTaskStatus = "IN_PROGRESS" | "ON_HOLD" | "COMPLETED";

type TaskStatusFormProps = {
  serviceRequestId: string;
  currentStatus: TaskStatus;
};

const statusActions = {
  OPEN: [],
  ASSIGNED: [{ label: "Görevi Başlat", nextStatus: "IN_PROGRESS" }],
  IN_PROGRESS: [
    { label: "Beklemeye Al", nextStatus: "ON_HOLD" },
    { label: "Görevi Tamamla", nextStatus: "COMPLETED" },
  ],
  ON_HOLD: [
    { label: "Devam Et", nextStatus: "IN_PROGRESS" },
    { label: "Görevi Tamamla", nextStatus: "COMPLETED" },
  ],
  COMPLETED: [],
  CANCELLED: [],
} as const satisfies Record<
  TaskStatus,
  readonly { label: string; nextStatus: NextTaskStatus }[]
>;

export function TaskStatusForm({
  serviceRequestId,
  currentStatus,
}: TaskStatusFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateTaskStatusAction,
    initialTaskStatusState,
  );
  const [pendingStatus, setPendingStatus] = useState<NextTaskStatus | null>(
    null,
  );
  const actions = statusActions[currentStatus];

  if (currentStatus === "COMPLETED") {
    return <p className={styles.completedMessage}>Görev tamamlandı.</p>;
  }

  if (actions.length === 0) {
    return null;
  }

  return (
    <form action={formAction} className={styles.statusActionForm}>
      <input name="serviceRequestId" type="hidden" value={serviceRequestId} />
      <div className={styles.statusActionButtons}>
        {actions.map((action) => (
          <button
            className={
              action.nextStatus === "COMPLETED"
                ? styles.completeActionButton
                : styles.statusActionButton
            }
            disabled={isPending}
            key={action.nextStatus}
            name="nextStatus"
            onClick={() => setPendingStatus(action.nextStatus)}
            type="submit"
            value={action.nextStatus}
          >
            {isPending && pendingStatus === action.nextStatus
              ? "İşleniyor..."
              : action.label}
          </button>
        ))}
      </div>

      {state.status === "success" && state.message ? (
        <p className={styles.statusSuccessMessage} role="status">
          {state.message}
        </p>
      ) : null}
      {state.status === "error" && state.message ? (
        <p className={styles.statusErrorMessage} role="alert">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

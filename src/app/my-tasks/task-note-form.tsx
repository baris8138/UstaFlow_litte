"use client";

import { useActionState, useEffect, useRef } from "react";

import { addServiceTaskNoteAction } from "./actions";
import styles from "./my-tasks.module.css";
import { initialTaskNoteState } from "./task-note-state";

type TaskNoteFormProps = {
  serviceRequestId: string;
};

export function TaskNoteForm({ serviceRequestId }: TaskNoteFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    addServiceTaskNoteAction,
    initialTaskNoteState,
  );

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className={styles.noteForm}>
      <input name="serviceRequestId" type="hidden" value={serviceRequestId} />
      <label className={styles.noteField}>
        <span>Yeni çalışma notu</span>
        <textarea
          disabled={isPending}
          maxLength={2000}
          name="content"
          placeholder="Yapılan işlemleri ve saha gözlemlerinizi yazın..."
          required
          rows={4}
        />
      </label>

      <div className={styles.noteFormFooter}>
        <button disabled={isPending} type="submit">
          {isPending ? "Kaydediliyor..." : "Notu Kaydet"}
        </button>

        {state.status === "success" && state.message ? (
          <p className={styles.noteSuccessMessage} role="status">
            {state.message}
          </p>
        ) : null}
        {state.status === "error" && state.message ? (
          <p className={styles.noteErrorMessage} role="alert">
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}

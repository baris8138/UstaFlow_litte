"use client";

import { useActionState } from "react";

import { initialCustomerStatusActionState } from "./customer-update-form-state";
import { setCustomerActiveStatusAction } from "./update-actions";
import styles from "./customers.module.css";

type CustomerStatusFormProps = {
  customerId: string;
  isActive: boolean;
};

export function CustomerStatusForm({
  customerId,
  isActive,
}: CustomerStatusFormProps) {
  const [state, formAction, isPending] = useActionState(
    setCustomerActiveStatusAction,
    initialCustomerStatusActionState,
  );

  return (
    <form action={formAction} className={styles.statusForm}>
      <input name="id" type="hidden" value={customerId} />
      <input name="isActive" type="hidden" value={String(!isActive)} />

      <button
        className={isActive ? styles.deactivateButton : styles.activateButton}
        type="submit"
        disabled={isPending}
      >
        {isPending ? "İşleniyor..." : isActive ? "Pasife al" : "Aktifleştir"}
      </button>

      {state.status === "error" && state.message ? (
        <p className={styles.statusErrorMessage} role="alert">
          {state.message}
        </p>
      ) : null}

      {state.status === "success" && state.message ? (
        <p className={styles.statusSuccessMessage} role="status">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

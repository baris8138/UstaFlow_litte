"use client";

import { useActionState, useEffect, useRef } from "react";

import { addServiceTaskMaterialAction } from "./actions";
import styles from "./my-tasks.module.css";
import { initialTaskMaterialState } from "./task-material-state";

type TaskMaterialFormProps = {
  serviceRequestId: string;
};

const unitOptions = [
  ["PIECE", "Adet"],
  ["METER", "Metre"],
  ["CENTIMETER", "Santimetre"],
  ["LITER", "Litre"],
  ["MILLILITER", "Mililitre"],
  ["KILOGRAM", "Kilogram"],
  ["GRAM", "Gram"],
  ["BOX", "Kutu"],
  ["PACK", "Paket"],
] as const;

export function TaskMaterialForm({ serviceRequestId }: TaskMaterialFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    addServiceTaskMaterialAction,
    initialTaskMaterialState,
  );

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className={styles.materialForm}>
      <input name="serviceRequestId" type="hidden" value={serviceRequestId} />

      <label className={styles.materialField}>
        <span>Malzeme adı</span>
        <input
          disabled={isPending}
          maxLength={120}
          name="name"
          placeholder="Örn. Cat6 Kablo"
          required
        />
      </label>

      <label className={styles.materialField}>
        <span>Miktar</span>
        <input
          disabled={isPending}
          inputMode="decimal"
          min="0.01"
          name="quantity"
          required
          step="0.01"
          type="number"
        />
      </label>

      <label className={styles.materialField}>
        <span>Birim</span>
        <select defaultValue="" disabled={isPending} name="unit" required>
          <option disabled value="">
            Birim seçin
          </option>
          {unitOptions.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <div className={styles.materialFormFooter}>
        <button disabled={isPending} type="submit">
          {isPending ? "Kaydediliyor..." : "Malzeme Ekle"}
        </button>
        {state.status === "success" && state.message ? (
          <p className={styles.materialSuccessMessage} role="status">
            {state.message}
          </p>
        ) : null}
        {state.status === "error" && state.message ? (
          <p className={styles.materialErrorMessage} role="alert">
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}

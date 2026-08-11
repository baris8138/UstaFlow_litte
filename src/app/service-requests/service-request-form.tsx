"use client";

import { useActionState, useRef, useState } from "react";

import { createServiceRequestAction } from "./actions";
import { initialServiceRequestFormState } from "./service-request-form-state";
import styles from "./service-requests.module.css";

type ServiceRequestFormProps = {
  customers: Array<{
    id: string;
    name: string;
    type: "INDIVIDUAL" | "CORPORATE";
  }>;
};

const initialFormValues = {
  customerId: "",
  title: "",
  description: "",
  priority: "MEDIUM",
  scheduledAt: "",
};

export function ServiceRequestForm({ customers }: ServiceRequestFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [formValues, setFormValues] = useState(initialFormValues);
  const submitAction = async (
    previousState: typeof initialServiceRequestFormState,
    formData: FormData,
  ) => {
    const nextState = await createServiceRequestAction(previousState, formData);

    if (nextState.status === "success") {
      setFormValues(initialFormValues);
      formRef.current?.reset();
    }

    return nextState;
  };
  const [state, formAction, isPending] = useActionState(
    submitAction,
    initialServiceRequestFormState,
  );

  return (
    <form ref={formRef} action={formAction} className={styles.form}>
      <div className={styles.formHeading}>
        <div>
          <p className={styles.eyebrow}>Yeni kayıt</p>
          <h2>Servis talebi oluştur</h2>
        </div>
        <p>Aktif bir müşteri seçerek servis ihtiyacını planlayın.</p>
      </div>

      <div className={styles.formGrid}>
        <label className={styles.fieldWide}>
          <span>Müşteri</span>
          <select
            name="customerId"
            value={formValues.customerId}
            onChange={(event) =>
              setFormValues((current) => ({
                ...current,
                customerId: event.target.value,
              }))
            }
            required
          >
            <option value="" disabled>
              Müşteri seçin
            </option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name} — {customer.type === "INDIVIDUAL" ? "Bireysel" : "Kurumsal"}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.fieldWide}>
          <span>Talep başlığı</span>
          <input
            name="title"
            type="text"
            value={formValues.title}
            onChange={(event) =>
              setFormValues((current) => ({
                ...current,
                title: event.target.value,
              }))
            }
            maxLength={160}
            required
          />
        </label>

        <label className={styles.fieldFull}>
          <span>Açıklama</span>
          <textarea
            name="description"
            value={formValues.description}
            onChange={(event) =>
              setFormValues((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            rows={5}
            required
          />
        </label>

        <label>
          <span>Öncelik</span>
          <select
            name="priority"
            value={formValues.priority}
            onChange={(event) =>
              setFormValues((current) => ({
                ...current,
                priority: event.target.value,
              }))
            }
          >
            <option value="LOW">Düşük</option>
            <option value="MEDIUM">Orta</option>
            <option value="HIGH">Yüksek</option>
            <option value="URGENT">Acil</option>
          </select>
        </label>

        <label>
          <span>Planlanan servis tarihi</span>
          <input
            name="scheduledAt"
            type="datetime-local"
            value={formValues.scheduledAt}
            onChange={(event) =>
              setFormValues((current) => ({
                ...current,
                scheduledAt: event.target.value,
              }))
            }
          />
        </label>
      </div>

      <div className={styles.formFooter}>
        {state.status === "error" && state.message ? (
          <p className={styles.errorMessage} role="alert">
            {state.message}
          </p>
        ) : null}

        {state.status === "success" && state.message ? (
          <p className={styles.successMessage} role="status">
            {state.message}
          </p>
        ) : null}

        <button type="submit" disabled={isPending}>
          {isPending ? "Oluşturuluyor..." : "Servis talebi oluştur"}
        </button>
      </div>
    </form>
  );
}

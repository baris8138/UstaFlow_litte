"use client";

import { useActionState, useEffect, useRef } from "react";

import { createCustomerAction } from "./actions";
import { initialCustomerFormState } from "./customer-form-state";
import styles from "./customers.module.css";

export function CustomerForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    createCustomerAction,
    initialCustomerFormState,
  );

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className={styles.form}>
      <div className={styles.formHeading}>
        <div>
          <p className={styles.eyebrow}>Yeni kayıt</p>
          <h2>Müşteri oluştur</h2>
        </div>
        <p>Zorunlu alanları doldurarak müşteri kaydını oluşturun.</p>
      </div>

      <div className={styles.formGrid}>
        <label className={styles.fieldWide}>
          <span>Müşteri adı veya unvanı</span>
          <input
            name="name"
            type="text"
            autoComplete="organization"
            maxLength={150}
            required
          />
        </label>

        <label>
          <span>Müşteri türü</span>
          <select name="type" defaultValue="INDIVIDUAL">
            <option value="INDIVIDUAL">Bireysel</option>
            <option value="CORPORATE">Kurumsal</option>
          </select>
        </label>

        <label>
          <span>Telefon</span>
          <input name="phone" type="tel" autoComplete="tel" />
        </label>

        <label>
          <span>E-posta</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
          />
        </label>

        <label className={styles.fieldWide}>
          <span>Adres</span>
          <textarea
            name="addressLine"
            autoComplete="street-address"
            maxLength={250}
            rows={3}
          />
        </label>

        <label>
          <span>Şehir</span>
          <input
            name="city"
            type="text"
            autoComplete="address-level2"
            maxLength={100}
          />
        </label>

        <label>
          <span>İlçe</span>
          <input
            name="district"
            type="text"
            autoComplete="address-level3"
            maxLength={100}
          />
        </label>

        <label>
          <span>Posta kodu</span>
          <input
            name="postalCode"
            type="text"
            autoComplete="postal-code"
            maxLength={20}
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
          {isPending ? "Kaydediliyor..." : "Müşteriyi kaydet"}
        </button>
      </div>
    </form>
  );
}

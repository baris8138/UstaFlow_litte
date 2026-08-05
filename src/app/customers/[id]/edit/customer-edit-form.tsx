"use client";

import { useActionState } from "react";

import {
  initialCustomerUpdateFormState,
} from "../../customer-update-form-state";
import { updateCustomerAction } from "../../update-actions";
import styles from "../../customers.module.css";

type CustomerEditFormProps = {
  customer: {
    id: string;
    name: string;
    type: "INDIVIDUAL" | "CORPORATE";
    phone: string;
    email: string;
    addressLine: string;
    city: string;
    district: string;
    postalCode: string;
  };
};

export function CustomerEditForm({ customer }: CustomerEditFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateCustomerAction,
    initialCustomerUpdateFormState,
  );

  return (
    <form action={formAction} className={styles.form}>
      <input name="id" type="hidden" value={customer.id} />

      <div className={styles.formHeading}>
        <div>
          <p className={styles.eyebrow}>Kayıt bilgileri</p>
          <h2>Müşteriyi güncelle</h2>
        </div>
        <p>Değişiklikleri kontrol edip güncelleme işlemini tamamlayın.</p>
      </div>

      <div className={styles.formGrid}>
        <label className={styles.fieldWide}>
          <span>Müşteri adı veya unvanı</span>
          <input
            name="name"
            type="text"
            autoComplete="organization"
            defaultValue={customer.name}
            maxLength={150}
            required
          />
        </label>

        <label>
          <span>Müşteri türü</span>
          <select name="type" defaultValue={customer.type}>
            <option value="INDIVIDUAL">Bireysel</option>
            <option value="CORPORATE">Kurumsal</option>
          </select>
        </label>

        <label>
          <span>Telefon</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            defaultValue={customer.phone}
          />
        </label>

        <label>
          <span>E-posta</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={customer.email}
            maxLength={254}
          />
        </label>

        <label className={styles.fieldWide}>
          <span>Adres</span>
          <textarea
            name="addressLine"
            autoComplete="street-address"
            defaultValue={customer.addressLine}
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
            defaultValue={customer.city}
            maxLength={100}
          />
        </label>

        <label>
          <span>İlçe</span>
          <input
            name="district"
            type="text"
            autoComplete="address-level3"
            defaultValue={customer.district}
            maxLength={100}
          />
        </label>

        <label>
          <span>Posta kodu</span>
          <input
            name="postalCode"
            type="text"
            autoComplete="postal-code"
            defaultValue={customer.postalCode}
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
          {isPending ? "Güncelleniyor..." : "Değişiklikleri kaydet"}
        </button>
      </div>
    </form>
  );
}

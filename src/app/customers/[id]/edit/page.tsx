import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { requireRole } from "@/lib/auth/access-control";
import { getCustomerById } from "@/lib/customer/get-customer-by-id";

import styles from "../../customers.module.css";
import { CustomerEditForm } from "./customer-edit-form";

export const metadata: Metadata = {
  title: "Müşteri Düzenle | UstaFlow Lite",
};

type CustomerEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CustomerEditPage({
  params,
}: CustomerEditPageProps) {
  await requireRole(["ADMIN"]);
  const { id } = await params;
  const result = await getCustomerById(id);

  if (!result.success) {
    notFound();
  }

  const { customer } = result;

  return (
    <main className={styles.page}>
      <div className={styles.editShell}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Müşteri yönetimi</p>
            <h1>Müşteri bilgilerini düzenle</h1>
            <p>
              <strong>{customer.name}</strong>
              <span
                className={
                  customer.isActive
                    ? styles.editActiveStatus
                    : styles.editInactiveStatus
                }
              >
                {customer.isActive ? "Aktif" : "Pasif"}
              </span>
            </p>
          </div>
          <Link className={styles.backLink} href="/customers">
            Müşterilere dön
          </Link>
        </header>

        <CustomerEditForm
          customer={{
            id: customer.id,
            name: customer.name,
            type: customer.type,
            phone: customer.phone ?? "",
            email: customer.email ?? "",
            addressLine: customer.addressLine ?? "",
            city: customer.city ?? "",
            district: customer.district ?? "",
            postalCode: customer.postalCode ?? "",
          }}
        />
      </div>
    </main>
  );
}

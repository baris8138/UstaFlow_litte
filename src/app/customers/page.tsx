import type { Metadata } from "next";
import Link from "next/link";

import { requireRole } from "@/lib/auth/access-control";
import { listCustomers } from "@/lib/customer/list-customers";

import { CustomerForm } from "./customer-form";
import styles from "./customers.module.css";

export const metadata: Metadata = {
  title: "Müşteri Yönetimi | UstaFlow Lite",
};

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function CustomersPage() {
  await requireRole(["ADMIN"]);
  const customers = await listCustomers();

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Operasyon yönetimi</p>
            <h1>Müşteri Yönetimi</h1>
            <p>
              Müşteri kayıtlarını tek noktadan oluşturun ve güncel müşteri
              listenizi görüntüleyin.
            </p>
          </div>
          <Link className={styles.backLink} href="/dashboard">
            Dashboard&apos;a dön
          </Link>
        </header>

        <CustomerForm />

        <section className={styles.listSection} aria-labelledby="customer-list">
          <div className={styles.listHeading}>
            <div>
              <p className={styles.eyebrow}>Kayıtlar</p>
              <h2 id="customer-list">Kayıtlı müşteriler</h2>
            </div>
            <span>{customers.length} müşteri</span>
          </div>

          {customers.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>Henüz müşteri kaydı yok</h3>
              <p>İlk müşteri kaydını yukarıdaki formdan oluşturabilirsiniz.</p>
            </div>
          ) : (
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Müşteri</th>
                    <th scope="col">Tür</th>
                    <th scope="col">Telefon</th>
                    <th scope="col">E-posta</th>
                    <th scope="col">Konum</th>
                    <th scope="col">Durum</th>
                    <th scope="col">Oluşturulma</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => {
                    const location = [customer.city, customer.district]
                      .filter(Boolean)
                      .join(" / ");

                    return (
                      <tr key={customer.id}>
                        <td className={styles.customerName}>{customer.name}</td>
                        <td>
                          {customer.type === "INDIVIDUAL"
                            ? "Bireysel"
                            : "Kurumsal"}
                        </td>
                        <td>{customer.phone ?? "-"}</td>
                        <td>{customer.email ?? "-"}</td>
                        <td>{location || "-"}</td>
                        <td>
                          <span
                            className={
                              customer.isActive
                                ? styles.activeBadge
                                : styles.inactiveBadge
                            }
                          >
                            {customer.isActive ? "Aktif" : "Pasif"}
                          </span>
                        </td>
                        <td>{dateFormatter.format(customer.createdAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

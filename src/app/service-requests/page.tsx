import type { Metadata } from "next";
import Link from "next/link";

import { requireRole } from "@/lib/auth/access-control";
import { listCustomers } from "@/lib/customer/list-customers";
import { listServiceRequests } from "@/lib/service-request/list-service-requests";
import { listActiveTechnicians } from "@/lib/technician/list-active-technicians";

import { ServiceRequestForm } from "./service-request-form";
import styles from "./service-requests.module.css";
import { TechnicianAssignmentForm } from "./technician-assignment-form";

export const metadata: Metadata = {
  title: "Servis Talepleri | UstaFlow Lite",
};

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  dateStyle: "medium",
  timeStyle: "short",
});

const priorityLabels = {
  LOW: "Düşük",
  MEDIUM: "Orta",
  HIGH: "Yüksek",
  URGENT: "Acil",
};

const statusLabels = {
  OPEN: "Açık",
  ASSIGNED: "Atandı",
  IN_PROGRESS: "Devam Ediyor",
  ON_HOLD: "Beklemede",
  COMPLETED: "Tamamlandı",
  CANCELLED: "İptal Edildi",
};

export default async function ServiceRequestsPage() {
  await requireRole(["ADMIN"]);

  const [customers, serviceRequests, technicians] = await Promise.all([
    listCustomers({ activeOnly: true }),
    listServiceRequests(),
    listActiveTechnicians(),
  ]);
  const customerOptions = customers.map(({ id, name, type }) => ({
    id,
    name,
    type,
  }));

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Operasyon yönetimi</p>
            <h1>Servis Talepleri</h1>
            <p>
              Yeni servis talepleri oluşturun ve kayıtlı taleplerin güncel
              durumunu tek noktadan izleyin.
            </p>
          </div>
          <Link className={styles.backLink} href="/dashboard">
            Dashboard&apos;a dön
          </Link>
        </header>

        {customerOptions.length === 0 ? (
          <section className={styles.noCustomer}>
            <h2>Aktif müşteri gerekli</h2>
            <p>
              Servis talebi oluşturabilmek için en az bir aktif müşteri
              bulunmalıdır.
            </p>
            <Link href="/customers">Müşteri yönetimine git</Link>
          </section>
        ) : (
          <ServiceRequestForm customers={customerOptions} />
        )}

        <section className={styles.listSection} aria-labelledby="request-list">
          <div className={styles.listHeading}>
            <div>
              <p className={styles.eyebrow}>Kayıtlar</p>
              <h2 id="request-list">Kayıtlı servis talepleri</h2>
            </div>
            <span>{serviceRequests.length} talep</span>
          </div>

          {serviceRequests.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>Henüz servis talebi yok</h3>
              <p>Yeni servis talebini yukarıdaki formdan oluşturabilirsiniz.</p>
            </div>
          ) : (
            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Talep</th>
                    <th scope="col">Müşteri</th>
                    <th scope="col">Öncelik</th>
                    <th scope="col">Durum</th>
                    <th scope="col">Teknisyen</th>
                    <th scope="col">Planlanan tarih</th>
                    <th scope="col">Oluşturulma</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceRequests.map((request) => (
                    <tr key={request.id}>
                      <td>
                        <strong className={styles.requestTitle}>
                          {request.title}
                        </strong>
                        <span className={styles.descriptionPreview}>
                          {request.description}
                        </span>
                      </td>
                      <td>
                        <strong className={styles.customerName}>
                          {request.customer.name}
                        </strong>
                        <span className={styles.customerMeta}>
                          {request.customer.type === "INDIVIDUAL"
                            ? "Bireysel"
                            : "Kurumsal"}
                          {!request.customer.isActive ? " · Pasif müşteri" : ""}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`${styles.badge} ${styles[`priority${request.priority}`]}`}
                        >
                          {priorityLabels[request.priority]}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`${styles.badge} ${styles[`status${request.status}`]}`}
                        >
                          {statusLabels[request.status]}
                        </span>
                      </td>
                      <td className={styles.technicianCell}>
                        {request.technician ? (
                          <span className={styles.technicianInfo}>
                            <strong>
                              {request.technician.firstName}{" "}
                              {request.technician.lastName}
                            </strong>
                            <small>{request.technician.email}</small>
                          </span>
                        ) : (
                          <span className={styles.unassigned}>Atanmadı</span>
                        )}
                        <TechnicianAssignmentForm
                          key={request.technicianId ?? "unassigned"}
                          serviceRequestId={request.id}
                          currentTechnicianId={request.technicianId}
                          technicians={technicians}
                        />
                      </td>
                      <td>
                        {request.scheduledAt
                          ? dateFormatter.format(request.scheduledAt)
                          : "-"}
                      </td>
                      <td>{dateFormatter.format(request.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

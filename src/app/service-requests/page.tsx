import type { Metadata } from "next";
import Link from "next/link";

import { requireRole } from "@/lib/auth/access-control";
import { listCustomers } from "@/lib/customer/list-customers";
import { listServiceRequests } from "@/lib/service-request/list-service-requests";
import { parseServiceRequestListFilter } from "@/lib/service-request/service-request-list-filter";
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

type ServiceRequestsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function stringParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

function optionalFilterParam(value: string | string[] | undefined) {
  const parameter = stringParam(value);

  return parameter === undefined || parameter.trim() === ""
    ? undefined
    : parameter;
}

export default async function ServiceRequestsPage({
  searchParams,
}: ServiceRequestsPageProps) {
  await requireRole(["ADMIN"]);

  const query = await searchParams;
  const rawFilters = {
    search: stringParam(query.search),
    status: stringParam(query.status),
    priority: stringParam(query.priority),
    technician: stringParam(query.technician),
    page: stringParam(query.page),
  };
  const normalizedFilters = {
    search: optionalFilterParam(query.search),
    status: optionalFilterParam(query.status),
    priority: optionalFilterParam(query.priority),
    technician: optionalFilterParam(query.technician),
    page: optionalFilterParam(query.page),
  };
  const parsedFilters = parseServiceRequestListFilter(normalizedFilters);

  const [customers, technicians] = await Promise.all([
    listCustomers({ activeOnly: true }),
    listActiveTechnicians(),
  ]);
  const serviceRequestResult = parsedFilters.success
    ? await listServiceRequests(parsedFilters.filters)
    : null;
  const serviceRequests = serviceRequestResult?.items ?? [];
  const pagination = serviceRequestResult?.pagination ?? null;
  const hasFilters = [
    normalizedFilters.search,
    normalizedFilters.status,
    normalizedFilters.priority,
    normalizedFilters.technician,
  ].some(
    (value) => value !== undefined,
  );
  const isPageOutOfRange =
    pagination !== null &&
    pagination.totalPages > 0 &&
    pagination.page > pagination.totalPages;
  const paginationHref = (page: number) => {
    const parameters = new URLSearchParams();

    for (const [key, value] of Object.entries({
      search: normalizedFilters.search,
      status: normalizedFilters.status,
      priority: normalizedFilters.priority,
      technician: normalizedFilters.technician,
    })) {
      if (value !== undefined) {
        parameters.set(key, value);
      }
    }

    if (page > 1) {
      parameters.set("page", String(page));
    }

    const queryString = parameters.toString();
    return queryString === ""
      ? "/service-requests"
      : `/service-requests?${queryString}`;
  };
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

        <section className={styles.filterSection} aria-labelledby="request-filter">
          <div className={styles.filterHeading}>
            <div>
              <p className={styles.eyebrow}>Arama ve filtreleme</p>
              <h2 id="request-filter">Servis Taleplerini Filtrele</h2>
            </div>
            <p>
              {pagination?.totalItems ?? 0} servis talebi bulundu.
            </p>
          </div>

          <form action="/service-requests" className={styles.filterForm} method="get">
            <label>
              <span>Arama</span>
              <input
                defaultValue={rawFilters.search ?? ""}
                maxLength={100}
                name="search"
                placeholder="Talep başlığı veya müşteri adı"
              />
            </label>

            <label>
              <span>Durum</span>
              <select defaultValue={rawFilters.status ?? ""} name="status">
                <option value="">Tümü</option>
                <option value="OPEN">Açık</option>
                <option value="ASSIGNED">Atandı</option>
                <option value="IN_PROGRESS">Devam Ediyor</option>
                <option value="ON_HOLD">Beklemede</option>
                <option value="COMPLETED">Tamamlandı</option>
                <option value="CANCELLED">İptal Edildi</option>
              </select>
            </label>

            <label>
              <span>Öncelik</span>
              <select defaultValue={rawFilters.priority ?? ""} name="priority">
                <option value="">Tümü</option>
                <option value="LOW">Düşük</option>
                <option value="MEDIUM">Orta</option>
                <option value="HIGH">Yüksek</option>
                <option value="URGENT">Acil</option>
              </select>
            </label>

            <label>
              <span>Teknisyen</span>
              <select defaultValue={rawFilters.technician ?? ""} name="technician">
                <option value="">Tümü</option>
                <option value="UNASSIGNED">Atanmamış</option>
                {technicians.map((technician) => (
                  <option key={technician.id} value={technician.id}>
                    {technician.firstName} {technician.lastName} — {technician.email}
                  </option>
                ))}
              </select>
            </label>

            <div className={styles.filterActions}>
              <button type="submit">Filtrele</button>
              <Link href="/service-requests">Filtreleri Temizle</Link>
            </div>
          </form>

          {!parsedFilters.success ? (
            <p className={styles.filterError} role="alert">
              Filtre bilgileri geçersiz. Lütfen seçimlerinizi kontrol edin.
            </p>
          ) : null}
        </section>

        <section className={styles.listSection} aria-labelledby="request-list">
          <div className={styles.listHeading}>
            <div>
              <p className={styles.eyebrow}>Kayıtlar</p>
              <h2 id="request-list">Kayıtlı servis talepleri</h2>
            </div>
            <span>{pagination?.totalItems ?? 0} talep</span>
          </div>

          {serviceRequests.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>
                {hasFilters
                  ? "Filtrelere uygun servis talebi bulunamadı."
                  : "Henüz servis talebi yok"}
              </h3>
              {isPageOutOfRange ? (
                <Link className={styles.emptyFilterLink} href={paginationHref(1)}>
                  İlk sayfaya dön
                </Link>
              ) : hasFilters ? (
                <Link className={styles.emptyFilterLink} href="/service-requests">
                  Filtreleri Temizle
                </Link>
              ) : (
                <p>Yeni servis talebini yukarıdaki formdan oluşturabilirsiniz.</p>
              )}
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
                    <th scope="col">İşlem</th>
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
                      <td>
                        <Link
                          className={styles.detailLink}
                          href={`/service-requests/${request.id}`}
                        >
                          Detayı Gör
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {pagination !== null &&
          pagination.totalPages > 0 &&
          !isPageOutOfRange ? (
            <nav
              aria-label="Servis talepleri sayfalama"
              className={styles.pagination}
            >
              {pagination.hasPreviousPage ? (
                <Link href={paginationHref(pagination.page - 1)}>Önceki</Link>
              ) : (
                <span aria-disabled="true">Önceki</span>
              )}

              <strong>
                Sayfa {pagination.page} / {pagination.totalPages}
              </strong>

              {pagination.hasNextPage ? (
                <Link href={paginationHref(pagination.page + 1)}>Sonraki</Link>
              ) : (
                <span aria-disabled="true">Sonraki</span>
              )}
            </nav>
          ) : null}
        </section>
      </div>
    </main>
  );
}

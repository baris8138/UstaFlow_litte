import type { Metadata } from "next";
import Link from "next/link";

import { requireRole } from "@/lib/auth/access-control";
import { getServiceRequestDetail } from "@/lib/service-request/get-service-request-detail";

import { ServiceScheduleForm } from "./service-schedule-form";
import styles from "./service-request-detail.module.css";

export const metadata: Metadata = { title: "Servis Talebi Detayı | UstaFlow Lite" };

type Props = { params: Promise<{ id: string }> };

const dateFormatter = new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" });
const statusLabels = { OPEN: "Açık", ASSIGNED: "Atandı", IN_PROGRESS: "Devam Ediyor", ON_HOLD: "Beklemede", COMPLETED: "Tamamlandı", CANCELLED: "İptal Edildi" };
const priorityLabels = { LOW: "Düşük", MEDIUM: "Orta", HIGH: "Yüksek", URGENT: "Acil" };
const unitLabels = { PIECE: "Adet", METER: "Metre", CENTIMETER: "Santimetre", LITER: "Litre", MILLILITER: "Mililitre", KILOGRAM: "Kilogram", GRAM: "Gram", BOX: "Kutu", PACK: "Paket" };

function formatQuantity(quantity: string) {
  return quantity.replace(/(\.\d*?[1-9])0+$/, "$1").replace(/\.0+$/, "");
}

export default async function ServiceRequestDetailPage({ params }: Props) {
  const currentUser = await requireRole(["ADMIN"]);
  void currentUser;
  const { id } = await params;
  const result = await getServiceRequestDetail(id);

  if (!result.success) {
    return (
      <main className={styles.page}>
        <section className={styles.notFound}>
          <p className={styles.eyebrow}>Servis talebi</p>
          <h1>Servis talebi bulunamadı</h1>
          <p>Aradığınız kayıt mevcut olmayabilir veya bağlantı geçersizdir.</p>
          <Link className={styles.backLink} href="/service-requests">Servis Taleplerine Dön</Link>
        </section>
      </main>
    );
  }

  const { serviceRequest } = result;
  const location = [serviceRequest.customer.city, serviceRequest.customer.district].filter(Boolean).join(" / ");

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div><p className={styles.eyebrow}>Operasyon yönetimi</p><h1>Servis Talebi Detayı</h1><p className={styles.requestTitle}>{serviceRequest.title}</p></div>
          <Link className={styles.backLink} href="/service-requests">Servis Taleplerine Dön</Link>
        </header>

        <section className={styles.summary} aria-label="Servis talebi özeti">
          <div><span>Durum</span><strong>{statusLabels[serviceRequest.status]}</strong></div>
          <div><span>Öncelik</span><strong>{priorityLabels[serviceRequest.priority]}</strong></div>
          <div><span>Planlanan servis</span><strong>{serviceRequest.plannedAt ? dateFormatter.format(serviceRequest.plannedAt) : "-"}</strong></div>
          <div><span>Oluşturulma</span><strong>{dateFormatter.format(serviceRequest.createdAt)}</strong></div>
          <div><span>Son güncelleme</span><strong>{dateFormatter.format(serviceRequest.updatedAt)}</strong></div>
        </section>

        <section className={`${styles.section} ${styles.scheduleSection}`}>
          <div className={styles.scheduleHeading}>
            <div>
              <p className={styles.eyebrow}>Operasyon zamanı</p>
              <h2>Servis Planlama</h2>
            </div>
            <p className={styles.scheduleCurrent}>
              {serviceRequest.plannedAt
                ? `Mevcut planlama: ${dateFormatter.format(serviceRequest.plannedAt)}`
                : "Henüz planlanmadı"}
            </p>
          </div>
          <ServiceScheduleForm
            currentPlannedAt={serviceRequest.plannedAt?.toISOString() ?? null}
            serviceRequestId={serviceRequest.id}
          />
        </section>

        <section className={styles.section}><h2>Talep Açıklaması</h2><p className={styles.description}>{serviceRequest.description}</p></section>

        <div className={styles.infoGrid}>
          <section className={styles.section}>
            <h2>Müşteri Bilgileri</h2>
            <dl className={styles.details}>
              <div><dt>Ad</dt><dd>{serviceRequest.customer.name}</dd></div>
              <div><dt>Tür</dt><dd>{serviceRequest.customer.type === "INDIVIDUAL" ? "Bireysel" : "Kurumsal"}</dd></div>
              <div><dt>E-posta</dt><dd>{serviceRequest.customer.email || "-"}</dd></div>
              <div><dt>Telefon</dt><dd>{serviceRequest.customer.phone || "-"}</dd></div>
              <div><dt>Adres</dt><dd>{serviceRequest.customer.addressLine || "-"}</dd></div>
              <div><dt>Şehir / İlçe</dt><dd>{location || "-"}</dd></div>
              <div><dt>Aktiflik</dt><dd>{serviceRequest.customer.isActive ? "Aktif" : "Pasif"}</dd></div>
            </dl>
          </section>
          <section className={styles.section}>
            <h2>Atanan Teknisyen</h2>
            {serviceRequest.technician ? (
              <dl className={styles.details}>
                <div><dt>Ad Soyad</dt><dd>{serviceRequest.technician.firstName} {serviceRequest.technician.lastName}</dd></div>
                <div><dt>E-posta</dt><dd>{serviceRequest.technician.email}</dd></div>
                <div><dt>Durum</dt><dd>{serviceRequest.technician.isActive ? "Aktif" : "Pasif"}</dd></div>
              </dl>
            ) : <p className={styles.empty}>Henüz teknisyen atanmadı.</p>}
          </section>
        </div>

        <section className={styles.section}>
          <h2>Çalışma Notları</h2>
          {serviceRequest.notes.length === 0 ? <p className={styles.empty}>Henüz çalışma notu eklenmemiş.</p> : (
            <ol className={styles.historyList}>{serviceRequest.notes.map((note) => (
              <li key={note.id}><p>{note.content}</p><div className={styles.meta}><strong>{note.technician.firstName} {note.technician.lastName}</strong><time dateTime={note.createdAt.toISOString()}>{dateFormatter.format(note.createdAt)}</time></div></li>
            ))}</ol>
          )}
        </section>

        <section className={styles.section}>
          <h2>Kullanılan Malzemeler</h2>
          {serviceRequest.materials.length === 0 ? <p className={styles.empty}>Henüz kullanılan malzeme kaydı bulunmuyor.</p> : (
            <ol className={styles.historyList}>{serviceRequest.materials.map((material) => (
              <li key={material.id}><div className={styles.materialHeading}><strong>{material.name}</strong><span>{formatQuantity(material.quantity)} {unitLabels[material.unit]}</span></div><div className={styles.meta}><span>{material.technician.firstName} {material.technician.lastName}</span><time dateTime={material.createdAt.toISOString()}>{dateFormatter.format(material.createdAt)}</time></div></li>
            ))}</ol>
          )}
        </section>
      </div>
    </main>
  );
}

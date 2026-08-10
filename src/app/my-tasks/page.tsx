import type { Metadata } from "next";
import Link from "next/link";

import { requireRole } from "@/lib/auth/access-control";
import { listAssignedTasks } from "@/lib/technician/list-assigned-tasks";

import styles from "./my-tasks.module.css";

export const metadata: Metadata = {
  title: "Görevlerim | UstaFlow Lite",
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

export default async function MyTasksPage() {
  const currentUser = await requireRole(["TECHNICIAN"]);
  const tasks = await listAssignedTasks(currentUser.id);

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Saha operasyonları</p>
            <h1>Görevlerim</h1>
            <p>
              Size atanmış servis taleplerini ve saha bilgilerini görüntüleyin.
            </p>
          </div>
          <Link className={styles.backLink} href="/dashboard">
            Dashboard&apos;a dön
          </Link>
        </header>

        {tasks.length === 0 ? (
          <section className={styles.emptyState}>
            <h2>Henüz atanmış göreviniz yok</h2>
            <p>
              Size yeni bir servis talebi atandığında burada görüntülenecektir.
            </p>
          </section>
        ) : (
          <section className={styles.taskGrid} aria-label="Atanmış görevler">
            {tasks.map((task) => {
              const location = [task.customer.city, task.customer.district]
                .filter(Boolean)
                .join(" / ");

              return (
                <article className={styles.taskCard} key={task.id}>
                  <div className={styles.cardHeader}>
                    <div>
                      <p className={styles.customerName}>{task.customer.name}</p>
                      <h2>{task.title}</h2>
                    </div>
                    <div className={styles.badges}>
                      <span
                        className={`${styles.badge} ${styles[`priority${task.priority}`]}`}
                      >
                        {priorityLabels[task.priority]}
                      </span>
                      <span
                        className={`${styles.badge} ${styles[`status${task.status}`]}`}
                      >
                        {statusLabels[task.status]}
                      </span>
                    </div>
                  </div>

                  <p className={styles.description}>{task.description}</p>

                  <div className={styles.detailGrid}>
                    <section aria-labelledby={`customer-${task.id}`}>
                      <h3 id={`customer-${task.id}`}>Müşteri</h3>
                      <dl>
                        <div>
                          <dt>Tür</dt>
                          <dd>
                            {task.customer.type === "INDIVIDUAL"
                              ? "Bireysel"
                              : "Kurumsal"}
                          </dd>
                        </div>
                        <div>
                          <dt>Telefon</dt>
                          <dd>{task.customer.phone ?? "-"}</dd>
                        </div>
                      </dl>
                    </section>

                    <section aria-labelledby={`field-${task.id}`}>
                      <h3 id={`field-${task.id}`}>Saha bilgileri</h3>
                      <dl>
                        <div>
                          <dt>Adres</dt>
                          <dd>{task.customer.addressLine ?? "-"}</dd>
                        </div>
                        <div>
                          <dt>Şehir / İlçe</dt>
                          <dd>{location || "-"}</dd>
                        </div>
                      </dl>
                    </section>
                  </div>

                  <dl className={styles.dates}>
                    <div>
                      <dt>Planlanan servis</dt>
                      <dd>
                        {task.scheduledAt
                          ? dateFormatter.format(task.scheduledAt)
                          : "-"}
                      </dd>
                    </div>
                    <div>
                      <dt>Oluşturulma</dt>
                      <dd>{dateFormatter.format(task.createdAt)}</dd>
                    </div>
                  </dl>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}

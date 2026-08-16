import type { Metadata } from "next";
import Link from "next/link";

import { requireRole } from "@/lib/auth/access-control";
import { listAssignedTasks } from "@/lib/technician/list-assigned-tasks";
import { listServiceTaskMaterials } from "@/lib/technician/list-service-task-materials";
import { listServiceTaskNotes } from "@/lib/technician/list-service-task-notes";

import styles from "./my-tasks.module.css";
import { TaskMaterialForm } from "./task-material-form";
import { TaskNoteForm } from "./task-note-form";
import { TaskStatusForm } from "./task-status-form";

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

const materialUnitLabels = {
  PIECE: "Adet",
  METER: "Metre",
  CENTIMETER: "Santimetre",
  LITER: "Litre",
  MILLILITER: "Mililitre",
  KILOGRAM: "Kilogram",
  GRAM: "Gram",
  BOX: "Kutu",
  PACK: "Paket",
};

function formatQuantity(quantity: string) {
  return quantity
    .replace(/(\.\d*?[1-9])0+$/, "$1")
    .replace(/\.0+$/, "");
}

export default async function MyTasksPage() {
  const currentUser = await requireRole(["TECHNICIAN"]);
  const tasks = await listAssignedTasks(currentUser.id);
  const tasksWithDetails = await Promise.all(
    tasks.map(async (task) => {
      const [notesResult, materialsResult] = await Promise.all([
        listServiceTaskNotes(task.id, currentUser.id),
        listServiceTaskMaterials(task.id, currentUser.id),
      ]);

      return {
        task,
        notes: notesResult.success ? notesResult.notes : [],
        materials: materialsResult.success ? materialsResult.materials : [],
      };
    }),
  );

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
            {tasksWithDetails.map(({ task, notes, materials }) => {
              const location = [task.customer.city, task.customer.district]
                .filter(Boolean)
                .join(" / ");
              const isTerminal =
                task.status === "COMPLETED" || task.status === "CANCELLED";

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

                  {!isTerminal ? (
                    <TaskStatusForm
                      currentStatus={task.status}
                      serviceRequestId={task.id}
                    />
                  ) : null}

                  {isTerminal ? (
                    <p className={styles.readOnlyMessage}>
                      {task.status === "COMPLETED"
                        ? "Bu görev tamamlandı. Çalışma geçmişini görüntüleyebilirsiniz."
                        : "Bu görev iptal edildi. Kayıt geçmişi yalnızca görüntülenebilir."}
                    </p>
                  ) : null}

                  <section
                    aria-labelledby={`notes-${task.id}`}
                    className={styles.notesSection}
                  >
                    <h3 id={`notes-${task.id}`}>Çalışma Notları</h3>
                    {!isTerminal ? (
                      <TaskNoteForm serviceRequestId={task.id} />
                    ) : null}

                    <div className={styles.noteHistory}>
                      <h4>Not Geçmişi</h4>
                      {notes.length === 0 ? (
                        <p className={styles.emptyNotes}>
                          Henüz çalışma notu eklenmemiş.
                        </p>
                      ) : (
                        <ol className={styles.noteList}>
                          {notes.map((note) => (
                            <li className={styles.noteItem} key={note.id}>
                              <div className={styles.noteMeta}>
                                <strong>
                                  {note.technician.firstName}{" "}
                                  {note.technician.lastName}
                                </strong>
                                <time dateTime={note.createdAt.toISOString()}>
                                  {dateFormatter.format(note.createdAt)}
                                </time>
                              </div>
                              <p>{note.content}</p>
                            </li>
                          ))}
                        </ol>
                      )}
                    </div>
                  </section>

                  <section
                    aria-labelledby={`materials-${task.id}`}
                    className={styles.materialsSection}
                  >
                    <h3 id={`materials-${task.id}`}>Kullanılan Malzemeler</h3>
                    {!isTerminal ? (
                      <TaskMaterialForm serviceRequestId={task.id} />
                    ) : null}

                    <div className={styles.materialHistory}>
                      <h4>Malzeme Geçmişi</h4>
                      {materials.length === 0 ? (
                        <p className={styles.emptyMaterials}>
                          Henüz kullanılan malzeme kaydı bulunmuyor.
                        </p>
                      ) : (
                        <ol className={styles.materialList}>
                          {materials.map((material) => (
                            <li className={styles.materialItem} key={material.id}>
                              <div className={styles.materialSummary}>
                                <strong>{material.name}</strong>
                                <span>
                                  {formatQuantity(material.quantity)}{" "}
                                  {materialUnitLabels[material.unit]}
                                </span>
                              </div>
                              <div className={styles.materialMeta}>
                                <span>
                                  {material.technician.firstName}{" "}
                                  {material.technician.lastName}
                                </span>
                                <time dateTime={material.createdAt.toISOString()}>
                                  {dateFormatter.format(material.createdAt)}
                                </time>
                              </div>
                            </li>
                          ))}
                        </ol>
                      )}
                    </div>
                  </section>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}

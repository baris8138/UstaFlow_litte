import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { requireRole } from "@/lib/auth/access-control";
import { getAdminDashboardMetrics } from "@/lib/dashboard/get-admin-dashboard-metrics";

import styles from "./admin.module.css";

export const metadata: Metadata = {
  title: "Yönetici Alanı | UstaFlow Lite",
  description: "UstaFlow Lite operasyon metrikleri ve yönetim alanları.",
};

export default async function AdminPage() {
  await requireRole(["ADMIN"]);
  const metrics = await getAdminDashboardMetrics();

  const metricCards = [
    {
      title: "Açık Talepler",
      value: metrics.openRequests,
      description: "İşleme alınmayı bekleyen açık servis talepleri.",
      href: "/service-requests?status=OPEN",
    },
    {
      title: "Atanmış Talepler",
      value: metrics.assignedRequests,
      description: "Bir teknisyene atanmış servis talepleri.",
      href: "/service-requests?status=ASSIGNED",
    },
    {
      title: "Devam Eden",
      value: metrics.inProgressRequests,
      description: "Saha çalışması devam eden servis talepleri.",
      href: "/service-requests?status=IN_PROGRESS",
    },
    {
      title: "Beklemede",
      value: metrics.onHoldRequests,
      description: "Operasyon sürecinde beklemeye alınan talepler.",
      href: "/service-requests?status=ON_HOLD",
    },
    {
      title: "Tamamlanan",
      value: metrics.completedRequests,
      description: "Başarıyla sonuçlandırılmış servis talepleri.",
      href: "/service-requests?status=COMPLETED",
    },
    {
      title: "Atanmamış",
      value: metrics.unassignedRequests,
      description: "Henüz bir teknisyene atanmamış talepler.",
      href: "/service-requests?technician=UNASSIGNED",
    },
    {
      title: "Aktif Teknisyen",
      value: metrics.activeTechnicians,
      description: "Operasyonlarda görev alabilecek aktif teknisyenler.",
    },
    {
      title: "Yaklaşan Servis",
      value: metrics.upcomingScheduledRequests,
      description: "İleri bir tarihe planlanmış aktif servis talepleri.",
    },
  ];

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <Image
            className={styles.logo}
            src="/brand/ustaflow-logo.svg"
            width={260}
            height={64}
            priority
            alt="UstaFlow Lite"
          />
          <div className={styles.headerActions}>
            <Link className={styles.backLink} href="/dashboard">
              Karşılama ekranı
            </Link>
            <SignOutButton />
          </div>
        </header>

        <div className={styles.heading}>
          <p>Yönetici alanı</p>
          <h1>Operasyon dashboard&apos;u</h1>
          <span>
            Servis operasyonlarının güncel durumunu izleyin ve yönetim
            alanlarına hızlıca ulaşın.
          </span>
        </div>

        <section
          className={styles.metricsSection}
          aria-labelledby="operations-summary-title"
        >
          <div className={styles.sectionHeading}>
            <p>Güncel durum</p>
            <h2 id="operations-summary-title">Operasyon Özeti</h2>
          </div>

          <div className={styles.metricsGrid}>
            {metricCards.map((metric) => (
              <article className={styles.metricCard} key={metric.title}>
                <h3>{metric.title}</h3>
                <strong className={styles.metricValue}>{metric.value}</strong>
                <p>{metric.description}</p>
                {metric.href ? (
                  <Link className={styles.metricLink} href={metric.href}>
                    Listeyi Gör <span aria-hidden="true">→</span>
                  </Link>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section
          className={styles.managementSection}
          aria-labelledby="management-title"
        >
          <div className={styles.sectionHeading}>
            <p>Yönetim</p>
            <h2 id="management-title">Operasyon alanları</h2>
          </div>

          <div className={styles.managementGrid}>
            <Link className={styles.managementCard} href="/customers">
              <span className={styles.managementTitle}>Müşteri Yönetimi</span>
              <span className={styles.managementDescription}>
                Müşteri kayıtlarını oluşturun, güncelleyin ve aktiflik
                durumlarını yönetin.
              </span>
              <span className={styles.managementCta}>Müşterilere git</span>
            </Link>

            <Link className={styles.managementCard} href="/service-requests">
              <span className={styles.managementTitle}>Servis Talepleri</span>
              <span className={styles.managementDescription}>
                Servis taleplerini görüntüleyin, oluşturun ve operasyonel
                atamalarını yönetin.
              </span>
              <span className={styles.managementCta}>Servis taleplerine git</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

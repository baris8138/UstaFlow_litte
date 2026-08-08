import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";

import styles from "./dashboard.module.css";

export const metadata: Metadata = {
  title: "Karşılama | UstaFlow Lite",
  description: "UstaFlow Lite giriş akışı doğrulama ekranı.",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { name, email, role } = session.user;

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="welcome-title">
        <Image
          className={styles.logo}
          src="/brand/ustaflow-logo.svg"
          width={260}
          height={64}
          priority
          alt="UstaFlow Lite"
        />

        <div className={styles.heading}>
          <p>Giriş başarılı</p>
          <h1 id="welcome-title">Hoş geldiniz{name ? `, ${name}` : ""}.</h1>
          <span>
            Oturumunuz doğrulandı. Bu ekran giriş akışını kontrol etmek için
            geçici olarak hazırlanmıştır.
          </span>
        </div>

        <dl className={styles.profile}>
          <div>
            <dt>Ad</dt>
            <dd>{name ?? "Belirtilmemiş"}</dd>
          </div>
          <div>
            <dt>E-posta</dt>
            <dd>{email ?? "Belirtilmemiş"}</dd>
          </div>
          <div>
            <dt>Rol</dt>
            <dd>{role}</dd>
          </div>
        </dl>

        {role === "ADMIN" ? (
          <>
            <Link className={styles.roleLink} href="/admin">
              Yönetici alanına git
            </Link>

            <section
              className={styles.management}
              aria-labelledby="management-title"
            >
              <div className={styles.managementHeading}>
                <p>Yönetim</p>
                <h2 id="management-title">Operasyon alanları</h2>
              </div>

              <div className={styles.managementGrid}>
                <Link className={styles.managementCard} href="/customers">
                  <span className={styles.cardTitle}>Müşteri Yönetimi</span>
                  <span className={styles.cardDescription}>
                    Müşteri kayıtlarını oluşturun, güncelleyin ve aktiflik
                    durumlarını yönetin.
                  </span>
                  <span className={styles.cardCta}>Müşterilere git</span>
                </Link>

                <Link
                  className={styles.managementCard}
                  href="/service-requests"
                >
                  <span className={styles.cardTitle}>Servis Talepleri</span>
                  <span className={styles.cardDescription}>
                    Müşteriler adına oluşturulan servis taleplerini görüntüleyin
                    ve yeni talepler oluşturun.
                  </span>
                  <span className={styles.cardCta}>
                    Servis taleplerine git
                  </span>
                </Link>
              </div>
            </section>
          </>
        ) : role === "TECHNICIAN" ? (
          <Link className={styles.roleLink} href="/technician">
            Teknik personel alanına git
          </Link>
        ) : null}

        <SignOutButton />
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import styles from "./unauthorized.module.css";

export const metadata: Metadata = {
  title: "Yetkisiz Erişim | UstaFlow Lite",
  description: "UstaFlow Lite yetkisiz erişim bilgilendirme ekranı.",
};

export default function UnauthorizedPage() {
  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="unauthorized-title">
        <Image
          className={styles.logo}
          src="/brand/ustaflow-logo.svg"
          width={220}
          height={54}
          priority
          alt="UstaFlow Lite"
        />

        <div className={styles.content}>
          <p className={styles.eyebrow}>Erişim sınırlandırıldı</p>
          <h1 id="unauthorized-title">
            Bu sayfaya erişim yetkiniz bulunmuyor.
          </h1>
          <p>Çalışma alanınıza güvenli biçimde devam edebilirsiniz.</p>
        </div>

        <Link className={styles.link} href="/dashboard">
          Dashboard&apos;a dön
        </Link>
      </section>
    </main>
  );
}

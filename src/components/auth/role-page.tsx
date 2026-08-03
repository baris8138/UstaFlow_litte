import Image from "next/image";
import Link from "next/link";

import styles from "./role-page.module.css";

type RolePageProps = {
  title: string;
  description: string;
  userName: string;
  role: "ADMIN" | "TECHNICIAN";
};

export function RolePage({
  title,
  description,
  userName,
  role,
}: RolePageProps) {
  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="role-page-title">
        <Image
          className={styles.logo}
          src="/brand/ustaflow-logo.svg"
          width={240}
          height={59}
          priority
          alt="UstaFlow Lite"
        />

        <div className={styles.heading}>
          <p>Korumalı çalışma alanı</p>
          <h1 id="role-page-title">{title}</h1>
          <span>{description}</span>
        </div>

        <dl className={styles.profile}>
          <div>
            <dt>Kullanıcı</dt>
            <dd>{userName}</dd>
          </div>
          <div>
            <dt>Rol</dt>
            <dd>{role}</dd>
          </div>
        </dl>

        <Link className={styles.link} href="/dashboard">
          Dashboard&apos;a dön
        </Link>
      </section>
    </main>
  );
}

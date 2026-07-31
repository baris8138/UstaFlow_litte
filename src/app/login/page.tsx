import type { Metadata } from "next";
import Image from "next/image";

import { LoginForm } from "./login-form";
import styles from "./login.module.css";

export const metadata: Metadata = {
  title: "Giriş | UstaFlow Lite",
  description: "UstaFlow Lite hesabınıza giriş yapın.",
};

const flowSteps = [
  ["01", "Talep oluşturuldu", "Müşteri kaydı alındı"],
  ["02", "Ekip yönlendirildi", "En uygun saha ekibi atandı"],
  ["03", "İş tamamlandı", "Servis raporu hazır"],
] as const;

export default function LoginPage() {
  return (
    <main className={styles.loginShell}>
      <section className={styles.introPanel} aria-labelledby="intro-title">
        <div className={styles.brand}>
          <Image src="/brand/ustaflow-mark.svg" width={44} height={44} alt="" />
          <span>UstaFlow Lite</span>
        </div>

        <div className={styles.introCopy}>
          <p className={styles.eyebrow}>Saha operasyon platformu</p>
          <h1 id="intro-title">Servis akışınız, her an kontrolünüzde.</h1>
          <p>Teknik servis ve saha operasyonlarını tek panelden yönetin.</p>
        </div>

        <div className={styles.flowPreview} aria-label="Üç aşamalı servis akışı">
          <div className={styles.flowLine} aria-hidden="true" />
          {flowSteps.map(([number, title, description], index) => (
            <div
              className={`${styles.flowStep} ${index === 1 ? styles.active : ""}`}
              key={number}
            >
              <span className={styles.stepIcon} aria-hidden="true">{number}</span>
              <span>
                <strong>{title}</strong>
                <small>{description}</small>
              </span>
            </div>
          ))}
        </div>

        <p className={styles.introFooter}>Daha hızlı ekipler. Daha mutlu müşteriler.</p>
      </section>

      <section className={styles.formPanel} aria-label="Giriş alanı">
        <LoginForm />
      </section>
    </main>
  );
}

"use client";

import type { FormEvent } from "react";
import Image from "next/image";

import styles from "./login.module.css";

export function LoginForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <div className={styles.loginCard}>
      <div className={styles.cardLogo}>
        <Image
          src="/brand/ustaflow-mark.svg"
          width={52}
          height={52}
          alt="UstaFlow Lite"
        />
      </div>

      <div className={styles.cardHeading}>
        <p className={styles.eyebrow}>Tekrar hoş geldiniz</p>
        <h2>UstaFlow Lite</h2>
        <p>Hesabınıza giriş yaparak operasyonlarınıza devam edin.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <label className={styles.fieldLabel} htmlFor="email">E-posta</label>
        <div className={styles.inputWrap}>
          <span aria-hidden="true">@</span>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="ornek@ustaflow.com"
            required
          />
        </div>

        <div className={styles.labelRow}>
          <label htmlFor="password">Parola</label>
          <a href="#">Şifremi unuttum</a>
        </div>
        <div className={styles.inputWrap}>
          <span aria-hidden="true">••</span>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Parolanızı girin"
            required
          />
        </div>

        <label className={styles.remember}>
          <input type="checkbox" name="remember" autoComplete="off" />
          <span>Beni hatırla</span>
        </label>

        <button className={styles.submitButton} type="submit">
          Giriş Yap <span aria-hidden="true">→</span>
        </button>
      </form>

      <p className={styles.support}>
        Giriş yapmakta sorun mu yaşıyorsunuz? <a href="#">Teknik destek</a>
      </p>
    </div>
  );
}

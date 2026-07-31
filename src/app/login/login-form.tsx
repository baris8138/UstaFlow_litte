"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { loginWithCredentials } from "./actions";
import styles from "./login.module.css";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const result = await loginWithCredentials(email, password);

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
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
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isSubmitting}
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
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <label className={styles.remember}>
          <input
            type="checkbox"
            name="remember"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            disabled={isSubmitting}
          />
          <span>Beni hatırla</span>
        </label>

        {error ? (
          <p className={styles.errorMessage} role="alert">
            {error}
          </p>
        ) : null}

        <button
          className={styles.submitButton}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Giriş yapılıyor..." : "Giriş Yap"}
          {!isSubmitting ? <span aria-hidden="true">→</span> : null}
        </button>
      </form>

      <p className={styles.support}>
        Giriş yapmakta sorun mu yaşıyorsunuz? <a href="#">Teknik destek</a>
      </p>
    </div>
  );
}

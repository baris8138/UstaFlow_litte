import { signOut } from "@/auth";

import styles from "./sign-out-button.module.css";

export function SignOutButton() {
  return (
    <form
      className={styles.form}
      action={async () => {
        "use server";

        await signOut({ redirectTo: "/login" });
      }}
    >
      <button className={styles.button} type="submit">
        Çıkış Yap
      </button>
    </form>
  );
}

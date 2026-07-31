"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";

type LoginResult =
  | { success: true }
  | { success: false; error: string };

export async function loginWithCredentials(
  email: string,
  password: string,
): Promise<LoginResult> {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { success: false, error: "E-posta veya parola hatalı." };
      }

      if (error.type === "CallbackRouteError" || error.type === "AdapterError") {
        throw error;
      }

      return { success: false, error: "Giriş işlemi tamamlanamadı." };
    }

    throw error;
  }
}

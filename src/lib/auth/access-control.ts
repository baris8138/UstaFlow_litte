import { redirect } from "next/navigation";

import { auth } from "@/auth";

export type AppRole = "ADMIN" | "TECHNICIAN";

export async function requireAuthenticatedUser() {
  const session = await auth();
  const user = session?.user;

  if (!user?.id || !user.role) {
    redirect("/login");
  }

  return user;
}

export async function requireRole(allowedRoles: readonly AppRole[]) {
  const user = await requireAuthenticatedUser();

  if (!allowedRoles.includes(user.role)) {
    redirect("/unauthorized");
  }

  return user;
}

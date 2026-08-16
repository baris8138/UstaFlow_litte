import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type AppRole = "ADMIN" | "TECHNICIAN";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: AppRole;
};

export type CurrentUserState =
  | { status: "unauthenticated" }
  | { status: "invalid-session" }
  | { status: "authenticated"; user: CurrentUser };

export async function getCurrentUserState(): Promise<CurrentUserState> {
  const session = await auth();
  const sessionUser = session?.user;

  if (!sessionUser?.id) {
    return { status: "unauthenticated" };
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  if (!currentUser || !currentUser.isActive) {
    return { status: "invalid-session" };
  }

  return {
    status: "authenticated",
    user: {
      id: currentUser.id,
      name: `${currentUser.firstName} ${currentUser.lastName}`,
      email: currentUser.email,
      role: currentUser.role,
    },
  };
}

export async function requireAuthenticatedUser(): Promise<CurrentUser> {
  const currentUserState = await getCurrentUserState();

  if (currentUserState.status === "invalid-session") {
    redirect("/auth/invalidate-session");
  }

  if (currentUserState.status === "unauthenticated") {
    redirect("/login");
  }

  return currentUserState.user;
}

export async function requireRole(allowedRoles: readonly AppRole[]) {
  const user = await requireAuthenticatedUser();

  if (!allowedRoles.includes(user.role)) {
    redirect("/unauthorized");
  }

  return user;
}

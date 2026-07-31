import { credentialsSchema } from "@/lib/auth/credentials";
import { verifyPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma";

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "TECHNICIAN";
};

export async function authenticateUser(
  credentials: unknown,
): Promise<AuthenticatedUser | null> {
  const parsedCredentials = credentialsSchema.safeParse(credentials);

  if (!parsedCredentials.success) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: parsedCredentials.data.email,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      passwordHash: true,
      role: true,
      isActive: true,
    },
  });

  if (!user || !user.isActive) {
    return null;
  }

  const isPasswordValid = await verifyPassword(
    parsedCredentials.data.password,
    user.passwordHash,
  );

  if (!isPasswordValid) {
    return null;
  }

  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    role: user.role,
  };
}

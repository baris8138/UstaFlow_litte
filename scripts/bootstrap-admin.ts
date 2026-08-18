import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { z } from "zod";

import { Prisma, PrismaClient } from "../src/generated/prisma/client";
import { hashPassword } from "../src/lib/auth/password";

const bootstrapEnvironmentSchema = z.object({
  DATABASE_URL: z.string().trim().min(1),
  BOOTSTRAP_ADMIN_EMAIL: z.string().trim().toLowerCase().max(254).email(),
  BOOTSTRAP_ADMIN_PASSWORD: z.string().min(12).max(128),
});

type ExistingUser = {
  role: "ADMIN" | "TECHNICIAN";
  isActive: boolean;
};

function handleExistingUser(user: ExistingUser): void {
  if (user.role === "ADMIN" && user.isActive) {
    console.log("An active ADMIN with this email already exists. No changes made.");
    return;
  }

  throw new Error(
    "A user with this email already exists but is not an active ADMIN. No changes made.",
  );
}

async function main(): Promise<void> {
  const parsedEnvironment = bootstrapEnvironmentSchema.safeParse(process.env);

  if (!parsedEnvironment.success) {
    throw new Error(
      "DATABASE_URL, a valid BOOTSTRAP_ADMIN_EMAIL, and a 12-128 character BOOTSTRAP_ADMIN_PASSWORD are required.",
    );
  }

  const { DATABASE_URL, BOOTSTRAP_ADMIN_EMAIL, BOOTSTRAP_ADMIN_PASSWORD } =
    parsedEnvironment.data;
  const adapter = new PrismaPg({ connectionString: DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: BOOTSTRAP_ADMIN_EMAIL },
      select: { role: true, isActive: true },
    });

    if (existingUser !== null) {
      handleExistingUser(existingUser);
      return;
    }

    const passwordHash = await hashPassword(BOOTSTRAP_ADMIN_PASSWORD);

    try {
      await prisma.user.create({
        data: {
          firstName: "System",
          lastName: "Administrator",
          email: BOOTSTRAP_ADMIN_EMAIL,
          passwordHash,
          role: "ADMIN",
          isActive: true,
        },
        select: { id: true },
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const concurrentlyCreatedUser = await prisma.user.findUnique({
          where: { email: BOOTSTRAP_ADMIN_EMAIL },
          select: { role: true, isActive: true },
        });

        if (concurrentlyCreatedUser !== null) {
          handleExistingUser(concurrentlyCreatedUser);
          return;
        }
      }

      throw error;
    }

    console.log("ADMIN user created successfully.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  const message =
    error instanceof Error
      ? error.message
      : "ADMIN bootstrap failed for an unknown reason.";

  console.error(message);
  process.exitCode = 1;
});

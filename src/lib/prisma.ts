import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not defined. Add a PostgreSQL connection string to your environment.",
  );
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const createPrismaClient = () => new PrismaClient({ adapter });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  process.env.NODE_ENV === "development"
    ? (globalForPrisma.prisma ??= createPrismaClient())
    : createPrismaClient();

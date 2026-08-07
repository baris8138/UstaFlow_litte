-- CreateEnum
CREATE TYPE "ServiceRequestStatus" AS ENUM ('OPEN', 'ASSIGNED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ServiceRequestPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateTable
CREATE TABLE "service_requests" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "technicianId" TEXT,
    "title" VARCHAR(160) NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ServiceRequestStatus" NOT NULL DEFAULT 'OPEN',
    "priority" "ServiceRequestPriority" NOT NULL DEFAULT 'MEDIUM',
    "scheduledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "service_requests_customerId_createdAt_idx" ON "service_requests"("customerId", "createdAt");

-- CreateIndex
CREATE INDEX "service_requests_technicianId_status_idx" ON "service_requests"("technicianId", "status");

-- CreateIndex
CREATE INDEX "service_requests_status_priority_idx" ON "service_requests"("status", "priority");

-- CreateIndex
CREATE INDEX "service_requests_createdAt_idx" ON "service_requests"("createdAt");

-- AddForeignKey
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "ServiceMaterialUnit" AS ENUM ('PIECE', 'METER', 'CENTIMETER', 'LITER', 'MILLILITER', 'KILOGRAM', 'GRAM', 'BOX', 'PACK');

-- CreateTable
CREATE TABLE "service_task_materials" (
    "id" TEXT NOT NULL,
    "serviceRequestId" TEXT NOT NULL,
    "technicianId" TEXT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "unit" "ServiceMaterialUnit" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_task_materials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "service_task_materials_serviceRequestId_createdAt_idx" ON "service_task_materials"("serviceRequestId", "createdAt");

-- AddForeignKey
ALTER TABLE "service_task_materials" ADD CONSTRAINT "service_task_materials_serviceRequestId_fkey" FOREIGN KEY ("serviceRequestId") REFERENCES "service_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_task_materials" ADD CONSTRAINT "service_task_materials_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

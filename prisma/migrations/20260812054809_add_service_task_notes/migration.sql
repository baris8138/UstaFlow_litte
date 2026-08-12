-- CreateTable
CREATE TABLE "service_task_notes" (
    "id" TEXT NOT NULL,
    "serviceRequestId" TEXT NOT NULL,
    "technicianId" TEXT NOT NULL,
    "content" VARCHAR(2000) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_task_notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "service_task_notes_serviceRequestId_createdAt_idx" ON "service_task_notes"("serviceRequestId", "createdAt");

-- AddForeignKey
ALTER TABLE "service_task_notes" ADD CONSTRAINT "service_task_notes_serviceRequestId_fkey" FOREIGN KEY ("serviceRequestId") REFERENCES "service_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_task_notes" ADD CONSTRAINT "service_task_notes_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

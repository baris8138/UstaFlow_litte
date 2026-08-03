import type { Metadata } from "next";

import { RolePage } from "@/components/auth/role-page";
import { requireRole } from "@/lib/auth/access-control";

export const metadata: Metadata = {
  title: "Teknik Personel Alanı | UstaFlow Lite",
  description: "UstaFlow Lite teknik personel çalışma alanı.",
};

export default async function TechnicianPage() {
  const user = await requireRole(["TECHNICIAN"]);

  return (
    <RolePage
      title="Teknik Personel Alanı"
      description="Bu sayfa henüz örnek amaçlı hazırlanmış korumalı bir teknik personel alanıdır."
      userName={user.name ?? user.email ?? "Kullanıcı"}
      role={user.role}
    />
  );
}

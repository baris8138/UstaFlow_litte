import type { Metadata } from "next";

import { RolePage } from "@/components/auth/role-page";
import { requireRole } from "@/lib/auth/access-control";

export const metadata: Metadata = {
  title: "Yönetici Alanı | UstaFlow Lite",
  description: "UstaFlow Lite yönetici çalışma alanı.",
};

export default async function AdminPage() {
  const user = await requireRole(["ADMIN"]);

  return (
    <RolePage
      title="Yönetici Alanı"
      description="Bu sayfa henüz örnek amaçlı hazırlanmış korumalı bir yönetici alanıdır."
      userName={user.name ?? user.email ?? "Kullanıcı"}
      role={user.role}
    />
  );
}

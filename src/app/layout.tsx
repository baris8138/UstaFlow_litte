import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UstaFlow Lite",
  description:
    "Teknik servis ve saha ekipleri için müşteri, servis ve görev yönetimi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

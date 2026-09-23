import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { ServiceWorkerRegister } from "@/components/layout/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: { default: "TechCompare", template: "%s · TechCompare" },
  description: "Compare peças de PC e periféricos com detalhes técnicos.",
  applicationName: "TechCompare",
  appleWebApp: { capable: true, title: "TechCompare", statusBarStyle: "black-translucent" },
  icons: { icon: "/icons/icon-192.png", apple: "/icons/icon-192.png" },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-dvh">
        <Navbar />
        <div className="mx-auto flex max-w-7xl">
          <Sidebar />
          <main className="min-w-0 flex-1 px-4 py-8 md:px-8">{children}</main>
        </div>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}

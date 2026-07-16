import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-card">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

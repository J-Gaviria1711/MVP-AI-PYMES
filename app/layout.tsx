import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import AIAssistant from "@/components/ai/AIAssistant";

export const metadata: Metadata = {
  title: "PYME.ai – Asistente Empresarial Inteligente",
  description:
    "Plataforma de inteligencia artificial para PYMES colombianas. Análisis de finanzas, operaciones y logística con IA de nivel experto.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className="h-full bg-[#F5F5F7]">
        <div className="flex h-full">
          <Sidebar />
          <main className="flex-1 flex flex-col min-h-screen overflow-auto" style={{ marginLeft: "260px" }}>
            {children}
          </main>
        </div>
        <AIAssistant />
      </body>
    </html>
  );
}

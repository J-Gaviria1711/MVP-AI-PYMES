import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import AIAssistant from "@/components/ai/AIAssistant";

export const metadata: Metadata = {
  title: "PYME.ai – Asistente Empresarial Inteligente",
  description: "Plataforma de inteligencia artificial para PYMES colombianas.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full" style={{ background: "var(--bg)" }}>
        <div className="flex h-full">
          <Sidebar />
          <main
            className="flex-1 flex flex-col min-h-screen overflow-auto"
            style={{ marginLeft: "260px" }}
          >
            {children}
          </main>
        </div>
        <AIAssistant />
      </body>
    </html>
  );
}

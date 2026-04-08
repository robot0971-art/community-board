import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Community Lounge",
  description: "크리에이티브한 사람들의 라운지",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Header />
        
        <main className="flex-1 max-w-6xl mx-auto px-6 py-8 w-full">
          {children}
        </main>
        
        <footer className="glass-card px-6 py-4 border-t border-neon-purple/30 text-center">
          <p className="text-white/60">
            © 2026 Community Lounge - 크리에이티브한 사람들의 라운지
          </p>
        </footer>
      </body>
    </html>
  );
}
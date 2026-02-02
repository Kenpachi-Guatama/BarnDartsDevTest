import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";

export const metadata: Metadata = {
  title: "King Family Dart League",
  description: "Official website for the King Family Dart League - Standings, Schedules, News and More",
  keywords: ["darts", "dart league", "standings", "schedule"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1a1a1a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#1a1a1a] text-white font-sans">
        <Navigation />
        <main className="min-h-screen pt-16 pb-8">
          {children}
        </main>
      </body>
    </html>
  );
}

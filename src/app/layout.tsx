import type { Metadata } from "next";
import { Inter, JetBrains_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { TickerBar } from "@/components/ticker-bar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "DataZ UI",
  description: "Latest Next.js Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${ibmPlexSansArabic.variable} font-sans antialiased`}
      >
        <Providers>
          <Navbar />
          <TickerBar />
          <main className="pt-6 min-h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}

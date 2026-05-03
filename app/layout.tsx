import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://ligaradar.de"),
  title: {
    default: "Liga Radar – Bundesliga Quotenvergleich & Spieler-Statistiken",
    template: "%s | Liga Radar",
  },
  description:
    "Vergleiche die besten Wettquoten für Bundesliga, 2. Bundesliga und 3. Liga. Aktuelle Spieler-Statistiken, Vereinsinfos und Spieltag-Übersichten.",
  keywords: [
    "Bundesliga Quoten",
    "Wettquoten Vergleich",
    "Bundesliga Statistiken",
    "Fußball Wetten Deutschland",
    "2. Bundesliga Quoten",
    "Spieler Statistiken Bundesliga",
  ],
  authors: [{ name: "Liga Radar" }],
  creator: "Liga Radar",
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "Liga Radar",
    title: "Liga Radar – Bundesliga Quotenvergleich",
    description:
      "Die besten Wettquoten für deutschen Fußball. Bundesliga, 2. Bundesliga & 3. Liga.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Liga Radar – Bundesliga Quotenvergleich",
    description:
      "Die besten Wettquoten für deutschen Fußball.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={inter.variable}>
      <body className="min-h-screen flex flex-col antialiased">
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

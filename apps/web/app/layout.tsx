import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  subsets:  ["latin"],
  weight:   ["400", "500", "600"],
  variable: "--font-plex-sans",
  display:  "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets:  ["latin"],
  weight:   ["400", "500", "600", "700"],
  variable: "--font-plex-mono",
  display:  "swap",
});

export const metadata: Metadata = {
  title:       "SignalScope — Real vs AI-Generated Image Assessment",
  description:
    "SignalScope provides a calibrated likelihood assessment of whether an image " +
    "is real or AI-generated. Results are estimates, not definitive determinations. " +
    "Built for SIH 2026, PS-2.",
  keywords: [
    "AI image detection",
    "synthetic image classifier",
    "image authenticity",
    "SignalScope",
    "SIH 2026",
  ],
  openGraph: {
    title:       "SignalScope — Real vs AI-Generated Image Assessment",
    description: "Calibrated likelihood assessment of image authenticity.",
    type:        "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${plexSans.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}

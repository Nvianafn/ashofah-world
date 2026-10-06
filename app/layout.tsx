import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const display = localFont({
  src: [
    { path: "../public/fonts/dm-sans-400.woff2", weight: "400" },
    { path: "../public/fonts/dm-sans-500.woff2", weight: "500" },
    { path: "../public/fonts/dm-sans-600.woff2", weight: "600" },
    { path: "../public/fonts/dm-sans-700.woff2", weight: "700" },
  ],
  display: "swap",
  variable: "--font-sans",
});
const pixel = localFont({
  src: "../public/fonts/press-start-2p.woff2",
  display: "swap",
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ashofah.me"),
  title: {
    default:
      "Ashofah World | Novian Affan Ashofah - Backend Developer & DevOps Engineer",
    template: "%s - Novian Affan Ashofah",
  },
  description:
    "Backend Developer & DevOps Engineer from Purwokerto. I build and ship reliable web systems with Laravel, Node.js, Next.js, and self-hosted infrastructure. Explore my work through an interactive terminal.",
  keywords: [
    "Novian Affan Ashofah",
    "Backend Developer",
    "DevOps Engineer",
    "Laravel",
    "Node.js",
    "Next.js",
    "Purwokerto",
  ],
  authors: [{ name: "Novian Affan Ashofah" }],
  creator: "Novian Affan Ashofah",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ashofah.me",
    siteName: "Novian Affan Ashofah",
    title: "Novian Affan Ashofah - Backend Developer & DevOps Engineer",
    description:
      "Backend Developer & DevOps Engineer. Explore my work through an interactive terminal.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Novian Affan Ashofah - Backend Developer & DevOps Engineer",
    description:
      "Backend Developer & DevOps Engineer. Explore my work through an interactive terminal.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0c0f20",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={display.variable + " " + pixel.variable}>
      <body>{children}</body>
    </html>
  );
}

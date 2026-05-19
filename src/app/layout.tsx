import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { Navbar, Footer } from "@/components/layout";

// ─── Font Setup ───────────────────────────────────────────────
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

// ─── SEO Metadata ─────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "AffiliateHub | Premium Recommendations",
    template: "%s | AffiliateHub",
  },
  description: "Discover the best products for Home Office, Tech, Kitchen, and Self-Care.",
  keywords: ["affiliate", "marketing", "nextjs", "tailwind"],
};

// ─── Root Layout ──────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-background text-foreground antialiased font-sans">
        {children}
      </body>
    </html>
  );
}

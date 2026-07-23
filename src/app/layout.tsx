import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "VgraphZ - Find Photographers & Videographers",
  description: "Discover verified photographers, videographers, and creative professionals near you. Contact them directly via WhatsApp or Call.",
  keywords: "photographers, videographers, creative professionals, wedding photography, event videography",
  authors: [{ name: "VgraphZ" }],
  openGraph: {
    title: "VgraphZ - Creative Professionals Marketplace",
    description: "Find and connect with verified photographers, videographers, and creative professionals.",
    url: "https://vgraphz.com",
    siteName: "VgraphZ",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${inter.variable} antialiased bg-slate-50 text-slate-900`}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
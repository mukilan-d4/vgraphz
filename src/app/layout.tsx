"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <title>VgraphZ - Find Photographers & Videographers</title>
        <meta name="description" content="Discover verified photographers, videographers, and creative professionals near you." />
      </head>
      <body className={`${inter.variable} antialiased bg-slate-50 text-slate-900`}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />

        {/* Global "Go to Top" Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95"
            aria-label="Go to top"
          >
            <ArrowUp size={22} className="animate-bounce" />
          </button>
        )}
      </body>
    </html>
  );
}
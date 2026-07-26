"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Menu, X } from "lucide-react";
import NotificationBadge from "./NotificationBadge";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-slate-900">
            VgraphZ
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-slate-600 hover:text-blue-600 transition">
              Home
            </Link>
            <Link href="/providers" className="text-slate-600 hover:text-blue-600 transition">
              Providers
            </Link>
            
            {user ? (
              <>
                <Link
                  href="/provider-dashboard"
                  className="text-slate-600 hover:text-blue-600 transition flex items-center gap-2"
                >
                  Dashboard
                  <NotificationBadge />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/register"
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition"
                >
                  Join Now
                </Link>
                <Link
                  href="/login"
                  className="text-sm text-slate-600 hover:text-blue-600 transition"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X size={24} className="text-slate-700" />
            ) : (
              <Menu size={24} className="text-slate-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 bg-white">
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                onClick={handleLinkClick}
                className="px-4 py-2 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition"
              >
                Home
              </Link>
              <Link
                href="/providers"
                onClick={handleLinkClick}
                className="px-4 py-2 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition"
              >
                Providers
              </Link>
              
              {user ? (
                <Link
                  href="/provider-dashboard"
                  onClick={handleLinkClick}
                  className="px-4 py-2 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition flex items-center gap-2"
                >
                  Dashboard
                  <NotificationBadge />
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    onClick={handleLinkClick}
                    className="mx-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-center transition"
                  >
                    Join Now
                  </Link>
                  <Link
                    href="/login"
                    onClick={handleLinkClick}
                    className="px-4 py-2 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl text-center transition"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
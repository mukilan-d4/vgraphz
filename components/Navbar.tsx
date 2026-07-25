"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

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

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-slate-900">
            VgraphZ
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link href="/" className="text-slate-600 hover:text-blue-600 transition">
              Home
            </Link>
            <Link href="/providers" className="text-slate-600 hover:text-blue-600 transition">
              Providers
            </Link>
            
            {user ? (
              <Link
                href="/provider-dashboard"
                className="rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition"
              >
                Dashboard
              </Link>
            ) : (
              <>
                {/* Join Now - Highlighted Button */}
                <Link
                  href="/register"
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition"
                >
                  Join Now
                </Link>
                {/* Login - Text Link */}
                <Link
                  href="/login"
                  className="text-sm text-slate-600 hover:text-blue-600 transition"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
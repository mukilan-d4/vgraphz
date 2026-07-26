import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid gap-10 md:grid-cols-4">
          
          {/* Brand */}
          <div className="md:col-span-1">
            <h2 className="text-2xl font-extrabold">
              <span className="text-slate-900">Vgraph</span>
              <span className="text-blue-600">Z</span>
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Connecting you with professional videographers and creative artists across India.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Explore
            </h3>
            <div className="mt-4 space-y-3">
              <Link
                href="/providers"
                className="block text-slate-600 transition hover:text-blue-600"
              >
                Find Professionals
              </Link>
              <Link
                href="/providers"
                className="block text-slate-600 transition hover:text-blue-600"
              >
                Categories
              </Link>
              <Link
                href="/register"
                className="block text-slate-600 transition hover:text-blue-600"
              >
                Become a Provider
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Company
            </h3>
            <div className="mt-4 space-y-3">
              <Link
                href="/about"
                className="block text-slate-600 transition hover:text-blue-600"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="block text-slate-600 transition hover:text-blue-600"
              >
                Contact
              </Link>
              <Link
                href="/privacy-policy"
                className="block text-slate-600 transition hover:text-blue-600"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="block text-slate-600 transition hover:text-blue-600"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>

          {/* Contact & Help */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Contact
            </h3>
            <div className="mt-4 space-y-3 text-slate-600">
              <p className="flex items-center gap-2">
                <span>📧</span>
                <a href="mailto:vgraphz1@gmail.com" className="hover:text-blue-600 transition">
                  vgraphz1@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span>📍</span>
                India
              </p>
              <p className="flex items-center gap-2">
                <span>🕒</span>
                Mon – Sat | 9 AM – 7 PM
              </p>
              {/* Help Option */}
              <Link
                href="mailto:vgraphz1@gmail.com?subject=Help%20Request%20-%20VgraphZ"
                className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition"
              >
                <span>🆘</span>
                Help & Support
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} VgraphZ. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
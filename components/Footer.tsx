import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

        <div className="grid gap-10 md:grid-cols-4">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-extrabold">
              <span className="text-slate-900">Vgraph</span>
              <span className="text-blue-600">Z</span>
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              VgraphZ helps customers discover trusted photographers,
              videographers, editors, and creative professionals across India.
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
                href="/join-provider"
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

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Contact
            </h3>

            <div className="mt-4 space-y-3 text-slate-600">

              <a
                href="mailto:support@vgraphz.com"
                className="flex items-center gap-2 transition hover:text-blue-600"
                aria-label="Email VgraphZ Support"
              >
                <span>📧</span>
                support@vgraphz.com
              </a>

              <p className="flex items-center gap-2">
                <span>📍</span>
                India
              </p>

              <p className="flex items-center gap-2">
                <span>🕒</span>
                Mon – Sat | 9 AM – 7 PM
              </p>

            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} VgraphZ. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
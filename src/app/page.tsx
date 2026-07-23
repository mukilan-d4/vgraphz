import Link from "next/link";
import { supabase } from "@/lib/supabase";
import SearchProviders from "@/components/SearchProviders";

export default async function Home() {
  // Get approved providers
  const { data: providers } = await supabase
    .from("videographers")
    .select("*")
    .eq("status", "approved")
    .eq("approved", true)
    .limit(6);

  // Get live statistics
  const { data: allApproved } = await supabase
    .from("videographers")
    .select("district, category")
    .eq("status", "approved")
    .eq("approved", true);

  const verifiedProviders = allApproved?.length || 0;

  // Count distinct cities (districts)
  const cities = new Set();
  allApproved?.forEach((p) => {
    if (p.district) cities.add(p.district);
  });
  const citiesCovered = cities.size || 0;

  // Count distinct categories
  const categories = new Set();
  allApproved?.forEach((p) => {
    if (p.category) categories.add(p.category);
  });
  const categoriesCount = categories.size || 0;

  // All Tamil Nadu districts
  const tamilNaduDistricts = [
    "Ariyalur",
    "Chengalpattu",
    "Chennai",
    "Coimbatore",
    "Cuddalore",
    "Dharmapuri",
    "Dindigul",
    "Erode",
    "Kallakurichi",
    "Kancheepuram",
    "Karur",
    "Krishnagiri",
    "Madurai",
    "Mayiladuthurai",
    "Nagapattinam",
    "Namakkal",
    "Nilgiris",
    "Perambalur",
    "Pudukkottai",
    "Ramanathapuram",
    "Ranipet",
    "Salem",
    "Sivaganga",
    "Tenkasi",
    "Thanjavur",
    "Theni",
    "Thoothukudi",
    "Tiruchirappalli",
    "Tirunelveli",
    "Tirupathur",
    "Tiruppur",
    "Tiruvallur",
    "Tiruvannamalai",
    "Tiruvarur",
    "Trichy",
    "Vellore",
    "Viluppuram",
    "Virudhunagar"
  ];

  return (
    <main className="min-h-screen bg-slate-50">

      {/* HERO */}

      <section className="bg-white py-24 md:py-32">

        <div className="mx-auto max-w-7xl px-6 text-center">

          <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-sm font-semibold text-blue-700">
            India's Creative Marketplace
          </span>

          <h1 className="mt-8 text-5xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-7xl">
            Find The Perfect
            <br />
            Photographer &
            <br />
            Videographer
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-8 text-slate-600">
            Discover verified photographers, videographers,
            drone pilots, editors and studios near you.
            Contact them directly with WhatsApp or Call.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">

            <Link
              href="/providers"
              className="rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Browse Professionals
            </Link>

            <Link
              href="/join-provider"
              className="rounded-2xl border border-slate-300 bg-white px-8 py-4 font-semibold text-slate-700 transition hover:border-blue-600 hover:text-blue-600"
            >
              Become a Provider
            </Link>

          </div>

          {/* Live Stats */}
          <div className="mt-16 grid gap-6 sm:grid-cols-2 md:grid-cols-4">

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <h2 className="text-4xl font-bold text-slate-900">
                {verifiedProviders}
              </h2>
              <p className="mt-2 text-sm font-medium text-slate-600">
                Verified Professionals
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <h2 className="text-4xl font-bold text-slate-900">
                {citiesCovered}
              </h2>
              <p className="mt-2 text-sm font-medium text-slate-600">
                Districts Covered
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <h2 className="text-4xl font-bold text-slate-900">
                {categoriesCount}
              </h2>
              <p className="mt-2 text-sm font-medium text-slate-600">
                Categories
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <h2 className="text-4xl font-bold text-slate-900">
                100%
              </h2>
              <p className="mt-2 text-sm font-medium text-slate-600">
                Free Enquiries
              </p>
            </div>

          </div>

          {/* Join Message */}
          <div className="mt-16 rounded-3xl bg-blue-50 border border-blue-100 p-8 max-w-4xl mx-auto">
            <p className="text-lg text-slate-700 leading-relaxed">
              <strong className="text-slate-900">Join India's growing creative marketplace.</strong>
              <br />
              Create your professional profile once. Customers searching for photographers, videographers, 
              editors and drone pilots can contact you directly through WhatsApp or Call. 
              <span className="font-semibold text-blue-700"> No commission. No middleman.</span>
            </p>
            <div className="mt-6">
              <Link
                href="/join-provider"
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5"
              >
                <span className="text-xl">🚀</span>
                Create Your Free Profile
              </Link>
            </div>
          </div>

        </div>

      </section>

      {/* SEARCH */}

      <section className="bg-white py-14">

        <div className="mx-auto max-w-7xl px-6">

          <h2 className="text-center text-4xl font-bold text-slate-900">
            Search Professionals
          </h2>

          <p className="mt-3 text-center leading-7 text-slate-600">
            Find creative professionals by category or location
          </p>

          <SearchProviders />

        </div>

      </section>

      {/* FEATURED PROVIDERS */}

      <section className="bg-slate-50 py-24">

        <div className="mx-auto max-w-7xl px-6">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-4xl font-bold text-slate-900">
                Featured Professionals
              </h2>

              <p className="mt-2 leading-7 text-slate-600">
                Trusted creative professionals from VgraphZ
              </p>

            </div>

            <Link
              href="/providers"
              className="font-semibold text-blue-600 hover:text-blue-700 transition"
            >
              View All →
            </Link>

          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-3">

            {providers?.map((provider) => (

              <div
                key={provider.id}
                className="group rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-xl"
              >

                <div className="flex justify-center pt-8">
                  <img
                    src={provider.profile_image || "/default-profile.png"}
                    className="h-32 w-32 rounded-full object-cover border-4 border-slate-200 transition duration-500 group-hover:scale-105 group-hover:border-blue-500"
                  />
                </div>

                <div className="p-7">

                  <div className="flex items-center justify-between">

                    <h3 className="text-2xl font-bold text-slate-900">
                      {provider.name}
                    </h3>

                    <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                      ✔ Verified
                    </span>

                  </div>

                  <p className="mt-4 font-semibold text-blue-600">
                    {provider.category}
                  </p>

                  <p className="mt-2 leading-7 text-slate-600">
                    📍 {provider.district}
                  </p>

                  {provider.experience && (
                    <p className="mt-2 leading-7 text-slate-600">
                      ⭐ {provider.experience} Years Experience
                    </p>
                  )}

                  <Link
                    href={`/providers/${provider.id}`}
                    className="mt-6 block rounded-2xl bg-blue-600 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-blue-700"
                  >
                    View Profile
                  </Link>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* WHY CHOOSE */}

      <section className="bg-white py-24">

        <div className="mx-auto max-w-7xl px-6">

          <h2 className="text-center text-5xl font-bold tracking-tight text-slate-900">
            Why Choose VgraphZ?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-center text-lg leading-7 text-slate-600">
            Trusted professionals, direct communication and a simple booking experience.
          </p>

          <div className="mt-14 grid gap-8 md:grid-cols-3">

            <div className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-xl">

              <div className="text-5xl transition duration-300 group-hover:scale-110">
                ✔
              </div>

              <h3 className="mt-6 text-2xl font-bold text-slate-900">
                Verified Professionals
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                Every provider is reviewed before becoming visible on the platform.
              </p>

            </div>

            <div className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-xl">

              <div className="text-5xl transition duration-300 group-hover:scale-110">
                💬
              </div>

              <h3 className="mt-6 text-2xl font-bold text-slate-900">
                Direct Contact
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                Call or WhatsApp providers directly without any middleman.
              </p>

            </div>

            <div className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-xl">

              <div className="text-5xl transition duration-300 group-hover:scale-110">
                ⚡
              </div>

              <h3 className="mt-6 text-2xl font-bold text-slate-900">
                Fast Response
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                Receive quick replies and connect with professionals easily.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* HOW IT WORKS */}

      <section className="bg-slate-50 py-24">

        <div className="mx-auto max-w-7xl px-6">

          <h2 className="text-center text-5xl font-bold tracking-tight text-slate-900">
            How VgraphZ Works
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-center text-lg leading-7 text-slate-600">
            Finding the right creative professional takes only three simple steps.
          </p>

          <div className="mt-14 grid gap-8 md:grid-cols-3">

            <div className="group rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-xl">

              <div className="mx-auto mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                1
              </div>

              <div className="text-5xl transition duration-300 group-hover:scale-110">
                🔍
              </div>

              <h3 className="mt-6 text-2xl font-bold text-slate-900">
                Search
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                Find photographers, videographers and creative professionals near you.
              </p>

            </div>

            <div className="group rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-xl">

              <div className="mx-auto mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                2
              </div>

              <div className="text-5xl transition duration-300 group-hover:scale-110">
                📞
              </div>

              <h3 className="mt-6 text-2xl font-bold text-slate-900">
                Contact
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                Contact professionals directly through Call or WhatsApp.
              </p>

            </div>

            <div className="group rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-xl">

              <div className="mx-auto mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                3
              </div>

              <div className="text-5xl transition duration-300 group-hover:scale-110">
                🎬
              </div>

              <h3 className="mt-6 text-2xl font-bold text-slate-900">
                Get Your Work Done
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                Discuss your requirements and complete your project.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* BECOME A PROVIDER CTA */}

      <section className="bg-blue-600 py-20 text-center text-white">

        <div className="mx-auto max-w-5xl px-6">

          <h2 className="text-5xl font-bold">
            Ready to Grow Your Creative Business?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-xl leading-7 text-blue-100">
            Create your verified VgraphZ profile, showcase your portfolio, and start receiving genuine customer enquiries directly through WhatsApp and phone calls.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">

            <Link
              href="/join-provider"
              className="rounded-2xl bg-white px-10 py-4 font-bold text-blue-600 shadow-sm transition hover:bg-slate-100 hover:shadow-lg hover:-translate-y-0.5"
            >
              Create Free Profile
            </Link>

            <Link
              href="/providers"
              className="rounded-2xl border-2 border-white bg-transparent px-10 py-4 font-bold text-white transition hover:bg-white/10"
            >
              Browse Providers
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}
"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import SearchProviders from "@/components/SearchProviders";
import { Phone, MessageCircle, Globe, FolderOpen } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [providers, setProviders] = useState<any[]>([]);
  const [verifiedProviders, setVerifiedProviders] = useState(0);
  const [citiesCovered, setCitiesCovered] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data: providersData } = await supabase
        .from("videographers")
        .select("*")
        .eq("status", "approved")
        .eq("approved", true)
        .limit(6);

      setProviders(providersData || []);

      const { data: allApproved } = await supabase
        .from("videographers")
        .select("district, category")
        .eq("status", "approved")
        .eq("approved", true);

      setVerifiedProviders(allApproved?.length || 0);

      const cities = new Set();
      allApproved?.forEach((p) => {
        if (p.district) cities.add(p.district);
      });
      setCitiesCovered(cities.size || 0);

      const categories = new Set();
      allApproved?.forEach((p) => {
        if (p.category) categories.add(p.category);
      });
      setCategoriesCount(categories.size || 0);

      setLoading(false);
    }

    loadData();
  }, []);

  const getOnlineLinks = (provider: any) => {
    const links = [];
    if (provider.website) links.push({ type: "website", url: provider.website, label: "Website", emoji: "🌐" });
    if (provider.instagram) links.push({ type: "instagram", url: provider.instagram, label: "Instagram", emoji: "📸" });
    if (provider.youtube) links.push({ type: "youtube", url: provider.youtube, label: "YouTube", emoji: "▶️" });
    if (provider.portfolio) links.push({ type: "portfolio", url: provider.portfolio, label: "Portfolio", emoji: "📁" });
    return links;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">

      {/* HERO */}
      <section className="bg-white py-12 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">

          <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-semibold text-blue-700">
            India's Creative Platform
          </span>

          <h1 className="mt-4 md:mt-8 text-3xl sm:text-5xl md:text-7xl font-extrabold leading-tight tracking-tight text-slate-900">
            Find The Perfect
            <br />
            Photographer &
            <br />
            Videographer
          </h1>

          <p className="mx-auto mt-4 md:mt-8 max-w-3xl text-sm sm:text-lg md:text-xl leading-relaxed text-slate-600 px-2">
            Discover verified photographers, videographers, editors and studios near you.
            Contact them directly through WhatsApp or Call.
          </p>

          <div className="mt-6 md:mt-10 flex flex-wrap justify-center gap-3 md:gap-4">
            <Link
              href="/providers"
              className="rounded-2xl bg-blue-600 hover:bg-blue-700 px-6 md:px-8 py-3.5 md:py-4 text-sm md:text-base font-semibold text-white shadow-sm transition hover:shadow-lg active:scale-95"
            >
              Browse Professionals
            </Link>

            <Link
              href="/register"
              className="rounded-2xl border border-slate-300 bg-white hover:border-blue-600 hover:text-blue-600 px-6 md:px-8 py-3.5 md:py-4 text-sm md:text-base font-semibold text-slate-700 transition hover:shadow-lg active:scale-95"
            >
              Join as a Creator
            </Link>
          </div>

          {/* LIVE STATS */}
          <div className="mt-8 md:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-6">
            <div className="rounded-2xl md:rounded-3xl border border-slate-200 bg-white p-3 md:p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">{verifiedProviders}</h2>
              <p className="mt-0.5 text-xs sm:text-sm md:text-base font-medium text-slate-600">Verified</p>
            </div>

            <div className="rounded-2xl md:rounded-3xl border border-slate-200 bg-white p-3 md:p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">{citiesCovered}</h2>
              <p className="mt-0.5 text-xs sm:text-sm md:text-base font-medium text-slate-600">Districts</p>
            </div>

            <div className="rounded-2xl md:rounded-3xl border border-slate-200 bg-white p-3 md:p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">{categoriesCount}</h2>
              <p className="mt-0.5 text-xs sm:text-sm md:text-base font-medium text-slate-600">Categories</p>
            </div>

            <div className="rounded-2xl md:rounded-3xl border border-slate-200 bg-white p-3 md:p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">100%</h2>
              <p className="mt-0.5 text-xs sm:text-sm md:text-base font-medium text-slate-600">Free</p>
            </div>
          </div>

          {/* CREATOR JOIN MESSAGE */}
          <div className="mt-8 md:mt-16 rounded-2xl md:rounded-3xl bg-blue-50 border border-blue-100 p-4 md:p-8 max-w-4xl mx-auto">
            <p className="text-sm sm:text-base md:text-lg text-slate-700 leading-relaxed">
              <strong className="text-slate-900">Get discovered by customers.</strong>
              <br className="hidden sm:block" />
              Create your creator profile once. Showcase your portfolio and let customers contact you directly.
              <span className="font-semibold text-blue-700"> No commission. No middleman.</span>
            </p>

            <div className="mt-3 md:mt-6">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 px-6 md:px-8 py-3 md:py-4 text-sm md:text-base font-semibold text-white shadow-sm transition hover:shadow-lg active:scale-95"
              >
                <span className="text-lg md:text-xl">🚀</span>
                Get Listed Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="bg-white py-8 md:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
            Search Professionals
          </h2>
          <p className="mt-2 md:mt-3 text-center text-sm sm:text-base md:text-lg leading-relaxed text-slate-600">
            Find photographers, videographers, editors and studios by category or location.
          </p>
          <SearchProviders />
        </div>
      </section>

      {/* FEATURED CREATORS */}
      <section className="bg-slate-50 py-12 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">Featured</h2>
              <p className="mt-1 text-sm sm:text-base md:text-lg text-slate-600">Trusted professionals</p>
            </div>
            <Link href="/providers" className="font-semibold text-blue-600 hover:text-blue-700 text-sm sm:text-base md:text-lg">
              View All →
            </Link>
          </div>

          <div className="mt-6 md:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {providers?.map((provider) => {
              const onlineLinks = getOnlineLinks(provider);
              const hasLinks = onlineLinks.length > 0;

              return (
                <div
                  key={provider.id}
                  className="group rounded-2xl md:rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-xl flex flex-col h-full"
                >
                  <div className="p-4 md:p-7 flex-1 flex flex-col">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                        {provider.name}
                      </h3>
                      <span className="rounded-full border border-green-200 bg-green-50 px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-semibold text-green-700 whitespace-nowrap ml-2">
                        ✔ Verified
                      </span>
                    </div>

                    <p className="mt-2 text-sm md:text-base font-semibold text-blue-600">{provider.category}</p>
                    <p className="mt-1 text-sm md:text-base text-slate-600">📍 {provider.district}</p>
                    {provider.experience && (
                      <p className="mt-1 text-sm md:text-base text-slate-600">⭐ {provider.experience}Y</p>
                    )}

                    {hasLinks && (
                      <div className="mt-3">
                        <p className="text-[10px] md:text-xs font-semibold text-slate-500">🔗 Online</p>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {onlineLinks.map((link, index) => (
                            <a
                              key={index}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center gap-1 px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-medium transition-all duration-200 active:scale-95 ${
                                link.type === "website"
                                  ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                  : link.type === "instagram"
                                  ? "bg-pink-50 text-pink-600 hover:bg-pink-100"
                                  : link.type === "youtube"
                                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                                  : "bg-purple-50 text-purple-600 hover:bg-purple-100"
                              }`}
                            >
                              <span>{link.emoji}</span>
                              {link.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex-1"></div>

                    {/* Action Buttons - Icons fixed size */}
                    <div className="mt-4 flex gap-2">
                      <a
                        href={`tel:${provider.phone}`}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-semibold py-2.5 md:py-3 rounded-xl transition-all duration-200 hover:shadow-md active:scale-95"
                      >
                        <Phone size={16} className="shrink-0" />
                        Call
                      </a>
                      <a
                        href={`https://wa.me/${provider.whatsapp || provider.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs md:text-sm font-semibold py-2.5 md:py-3 rounded-xl transition-all duration-200 hover:shadow-md active:scale-95"
                      >
                        <MessageCircle size={16} className="shrink-0" />
                        WhatsApp
                      </a>
                    </div>

                    <Link
                      href={`/providers/${provider.id}`}
                      className="mt-2 block w-full rounded-xl md:rounded-2xl bg-purple-600 hover:bg-blue-600 py-2.5 md:py-3 text-center text-xs md:text-sm font-semibold text-white transition-all duration-300 hover:shadow-md active:scale-95"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="bg-white py-12 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900">Why Choose VgraphZ?</h2>
          <p className="mx-auto mt-2 md:mt-5 max-w-2xl text-center text-sm sm:text-base md:text-lg leading-relaxed text-slate-600">
            Trusted creators, direct communication and a simple way to connect.
          </p>

          <div className="mt-8 md:mt-14 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <div className="group rounded-2xl md:rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-xl">
              <div className="text-4xl md:text-5xl">✔</div>
              <h3 className="mt-3 md:mt-6 text-lg md:text-2xl font-bold text-slate-900">Verified</h3>
              <p className="mt-2 text-sm md:text-base text-slate-600">Every creator is reviewed before appearing.</p>
            </div>

            <div className="group rounded-2xl md:rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-xl">
              <div className="text-4xl md:text-5xl">💬</div>
              <h3 className="mt-3 md:mt-6 text-lg md:text-2xl font-bold text-slate-900">Direct</h3>
              <p className="mt-2 text-sm md:text-base text-slate-600">Contact creators directly via WhatsApp or Call.</p>
            </div>

            <div className="group rounded-2xl md:rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-xl">
              <div className="text-4xl md:text-5xl">⚡</div>
              <h3 className="mt-3 md:mt-6 text-lg md:text-2xl font-bold text-slate-900">Opportunity</h3>
              <p className="mt-2 text-sm md:text-base text-slate-600">Get discovered by customers searching for services.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-slate-50 py-12 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900">How It Works</h2>
          <p className="mx-auto mt-2 md:mt-5 max-w-2xl text-center text-sm sm:text-base md:text-lg leading-relaxed text-slate-600">
            Connect with creators in three simple steps.
          </p>

          <div className="mt-8 md:mt-14 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            <div className="group rounded-2xl md:rounded-3xl border border-slate-200 bg-white p-6 md:p-10 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-xl">
              <div className="mx-auto mb-3 md:mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">1</div>
              <div className="text-4xl md:text-5xl">🔍</div>
              <h3 className="mt-3 md:mt-6 text-lg md:text-2xl font-bold text-slate-900">Search</h3>
              <p className="mt-2 text-sm md:text-base text-slate-600">Find photographers, videographers near you.</p>
            </div>

            <div className="group rounded-2xl md:rounded-3xl border border-slate-200 bg-white p-6 md:p-10 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-xl">
              <div className="mx-auto mb-3 md:mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">2</div>
              <div className="text-4xl md:text-5xl">📞</div>
              <h3 className="mt-3 md:mt-6 text-lg md:text-2xl font-bold text-slate-900">Contact</h3>
              <p className="mt-2 text-sm md:text-base text-slate-600">Contact creators directly via WhatsApp or Call.</p>
            </div>

            <div className="group rounded-2xl md:rounded-3xl border border-slate-200 bg-white p-6 md:p-10 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-xl">
              <div className="mx-auto mb-3 md:mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">3</div>
              <div className="text-4xl md:text-5xl">🎬</div>
              <h3 className="mt-3 md:mt-6 text-lg md:text-2xl font-bold text-slate-900">Complete</h3>
              <p className="mt-2 text-sm md:text-base text-slate-600">Discuss requirements and get your work done.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-12 md:py-20 text-center text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold">Get More Clients</h2>
          <p className="mx-auto mt-2 md:mt-5 max-w-2xl text-sm sm:text-base md:text-xl leading-relaxed text-blue-100">
            Create your creator profile, showcase your portfolio, and let customers discover your services.
          </p>

          <div className="mt-6 md:mt-8 flex flex-wrap justify-center gap-3 md:gap-4">
            <Link
              href="/register"
              className="rounded-2xl bg-white hover:bg-slate-100 px-6 md:px-10 py-3 md:py-4 text-sm md:text-base font-bold text-blue-600 shadow-sm transition hover:shadow-lg active:scale-95"
            >
              Join as Creator
            </Link>
            <Link
              href="/providers"
              className="rounded-2xl border-2 border-white bg-transparent hover:bg-white/10 px-6 md:px-10 py-3 md:py-4 text-sm md:text-base font-bold text-white transition hover:shadow-lg active:scale-95"
            >
              Browse Creators
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
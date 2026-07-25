"use client";

import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Phone, MessageCircle, Globe, FolderOpen } from "lucide-react";

export default function ProvidersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState({
    name: searchParams.get("name") || "",
    district: searchParams.get("district") || "",
    category: searchParams.get("category") || ""
  });

  // Helper to get online presence links
  const getOnlineLinks = (provider: any) => {
    const links = [];
    if (provider.website) links.push({ type: "website", url: provider.website, label: "Website", emoji: "🌐" });
    if (provider.instagram) links.push({ type: "instagram", url: provider.instagram, label: "Instagram", emoji: "📸" });
    if (provider.youtube) links.push({ type: "youtube", url: provider.youtube, label: "YouTube", emoji: "▶️" });
    if (provider.portfolio) links.push({ type: "portfolio", url: provider.portfolio, label: "Portfolio", emoji: "📁" });
    return links;
  };

  async function loadProviders() {
    setLoading(true);

    const name = searchParams.get("name") || "";
    const district = searchParams.get("district") || "";
    const category = searchParams.get("category") || "";

    let query = supabase
      .from("videographers")
      .select("*")
      .eq("status", "approved")
      .eq("approved", true);

    if (name.trim()) {
      query = query.ilike("name", `%${name.trim()}%`);
    }

    if (district.trim()) {
      query = query.ilike("district", `%${district.trim()}%`);
    }

    if (category.trim()) {
      query = query.eq("category", category);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false
    });

    if (error) {
      console.log(error);
      setProviders([]);
      setLoading(false);
      return;
    }

    const finalProviders = Array.from(
      new Map(
        (data || []).map(item => [item.id, item])
      ).values()
    );

    const providersWithReviews = await Promise.all(
      finalProviders.map(async (provider) => {
        const { count, error: countError } = await supabase
          .from("reviews")
          .select("*", { count: 'exact', head: true })
          .eq("provider_id", provider.id);

        if (countError) {
          console.error("Error fetching review count:", countError);
          return { ...provider, review_count: 0 };
        }

        return { ...provider, review_count: count || 0 };
      })
    );

    setProviders(providersWithReviews);
    setTotalCount(providersWithReviews.length);
    setLoading(false);
  }

  useEffect(() => {
    loadProviders();
  }, [searchParams.toString()]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams();

    if (filters.name) {
      params.set("name", filters.name);
    }

    if (filters.district) {
      params.set("district", filters.district);
    }

    if (filters.category) {
      params.set("category", filters.category);
    }

    router.replace(`/providers?${params.toString()}`, {
      scroll: false
    });
  }

  function clearFilters() {
    setFilters({
      name: "",
      district: "",
      category: ""
    });

    router.replace("/providers", {
      scroll: false
    });
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading professionals...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-28">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-center text-4xl font-bold text-slate-900">
          Find Creative Professionals
        </h1>

        <p className="text-center mt-3 text-slate-600">
          Book trusted creators near you
        </p>

        <form
          onSubmit={handleSearch}
          className="mt-10 grid gap-4 rounded-3xl bg-white border p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-4"
        >
          <input
            placeholder="Search name"
            value={filters.name}
            onChange={(e) =>
              setFilters({
                ...filters,
                name: e.target.value
              })
            }
            className="rounded-2xl border px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
          />

          <select
            value={filters.district}
            onChange={(e) =>
              setFilters({
                ...filters,
                district: e.target.value
              })
            }
            className="rounded-2xl border px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
          >
            <option value="">All Districts</option>
            <option value="Ariyalur">Ariyalur</option>
            <option value="Chengalpattu">Chengalpattu</option>
            <option value="Chennai">Chennai</option>
            <option value="Coimbatore">Coimbatore</option>
            <option value="Cuddalore">Cuddalore</option>
            <option value="Dharmapuri">Dharmapuri</option>
            <option value="Dindigul">Dindigul</option>
            <option value="Erode">Erode</option>
            <option value="Kallakurichi">Kallakurichi</option>
            <option value="Kancheepuram">Kancheepuram</option>
            <option value="Karur">Karur</option>
            <option value="Krishnagiri">Krishnagiri</option>
            <option value="Madurai">Madurai</option>
            <option value="Mayiladuthurai">Mayiladuthurai</option>
            <option value="Nagapattinam">Nagapattinam</option>
            <option value="Namakkal">Namakkal</option>
            <option value="Nilgiris">Nilgiris</option>
            <option value="Perambalur">Perambalur</option>
            <option value="Pudukkottai">Pudukkottai</option>
            <option value="Ramanathapuram">Ramanathapuram</option>
            <option value="Ranipet">Ranipet</option>
            <option value="Salem">Salem</option>
            <option value="Sivaganga">Sivaganga</option>
            <option value="Tenkasi">Tenkasi</option>
            <option value="Thanjavur">Thanjavur</option>
            <option value="Theni">Theni</option>
            <option value="Thoothukudi">Thoothukudi</option>
            <option value="Tiruchirappalli">Tiruchirappalli</option>
            <option value="Tirunelveli">Tirunelveli</option>
            <option value="Tirupathur">Tirupathur</option>
            <option value="Tiruppur">Tiruppur</option>
            <option value="Tiruvallur">Tiruvallur</option>
            <option value="Tiruvannamalai">Tiruvannamalai</option>
            <option value="Tiruvarur">Tiruvarur</option>
            <option value="Trichy">Trichy</option>
            <option value="Vellore">Vellore</option>
            <option value="Viluppuram">Viluppuram</option>
            <option value="Virudhunagar">Virudhunagar</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({
                ...filters,
                category: e.target.value
              })
            }
            className="rounded-2xl border px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
          >
            <option value="">All Categories</option>
            <option value="Photographer">Photographer</option>
            <option value="Videographer">Videographer</option>
            <option value="Video Editor">Video Editor</option>
            <option value="Photo Editor">Photo Editor</option>
          </select>

          <button
            type="submit"
            className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          >
            Search
          </button>
        </form>

        <button
          onClick={clearFilters}
          className="mt-5 block mx-auto text-blue-600 font-semibold hover:text-blue-700 transition"
        >
          Clear Filters
        </button>

        <div className="text-center mt-5 text-slate-500">
          Showing {totalCount} professionals
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 pb-10">
          {providers.map((provider) => {
            const onlineLinks = getOnlineLinks(provider);
            const hasLinks = onlineLinks.length > 0;

            return (
              <div
                key={provider.id}
                className="group rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-xl flex flex-col h-full"
              >
                <div className="p-7 flex-1 flex flex-col">
                  {/* Name and Verified Badge */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                      {provider.name}
                    </h3>
                    <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                      ✔ Verified
                    </span>
                  </div>

                  {/* Category */}
                  <p className="mt-4 font-semibold text-blue-600">{provider.category}</p>

                  {/* Location */}
                  <p className="mt-2 leading-7 text-slate-600">📍 {provider.district}</p>

                  {/* Experience */}
                  {provider.experience && (
                    <p className="mt-2 leading-7 text-slate-600">⭐ {provider.experience} Years Experience</p>
                  )}

                  {/* Reviews Count */}
                  {provider.review_count !== undefined && (
                    <p className="mt-2 text-sm text-slate-500">📝 {provider.review_count} {provider.review_count === 1 ? 'Review' : 'Reviews'}</p>
                  )}

                  {/* Online Presence Links */}
                  {hasLinks && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-slate-500 mb-2">🔗 Online Presence</p>
                      <div className="flex flex-wrap gap-2">
                        {onlineLinks.map((link, index) => (
                          <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 hover:scale-105 ${
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

                  {/* Spacer to push buttons to bottom */}
                  <div className="flex-1"></div>

                  {/* ACTION BUTTONS */}
                  <div className="mt-4 flex gap-2">
                    <a
                      href={`tel:${provider.phone}`}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-xl transition-all duration-200 hover:shadow-md"
                    >
                      <Phone size={16} />
                      Call
                    </a>
                    <a
                      href={`https://wa.me/${provider.whatsapp || provider.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2 rounded-xl transition-all duration-200 hover:shadow-md"
                    >
                      <MessageCircle size={16} />
                      WhatsApp
                    </a>
                  </div>

                  {/* View Profile Button */}
                  <Link
                    href={`/providers/${provider.id}`}
                    className="mt-3 block w-full rounded-2xl bg-purple-600 hover:bg-blue-600 py-2.5 text-center font-semibold text-white transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {providers.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-slate-900">No professionals found</h3>
            <p className="text-slate-600 mt-2">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="mt-4 inline-block rounded-2xl bg-blue-600 hover:bg-blue-700 px-6 py-3 text-white font-semibold transition-all duration-200 hover:shadow-lg"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
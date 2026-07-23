"use client";

import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProviderCard from "@/components/ProviderCard";

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
            className="rounded-2xl border px-4 py-3"
          />

          <select
            value={filters.district}
            onChange={(e) =>
              setFilters({
                ...filters,
                district: e.target.value
              })
            }
            className="rounded-2xl border px-4 py-3"
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
            className="rounded-2xl border px-4 py-3"
          >
            <option value="">All Categories</option>
            <option value="Photographer">Photographer</option>
            <option value="Videographer">Videographer</option>
            <option value="Video Editor">Video Editor</option>
            <option value="Photo Editor">Photo Editor</option>
          </select>

          <button
            type="submit"
            className="rounded-2xl bg-blue-600 text-white font-semibold"
          >
            Search
          </button>
        </form>

        <button
          onClick={clearFilters}
          className="mt-5 block mx-auto text-blue-600 font-semibold"
        >
          Clear Filters
        </button>

        <div className="text-center mt-5 text-slate-500">
          Showing {totalCount} professionals
        </div>

        {loading ? (
          <div className="text-center mt-10">Loading...</div>
        ) : (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 pb-10">
            {providers.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
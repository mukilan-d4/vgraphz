"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    if (!currentUser) {
      window.location.href = "/login";
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", currentUser.id)
      .single();

    if (profileError || profile?.role !== "admin") {
      window.location.href = "/provider-dashboard";
      return;
    }

    await loadProviders();
    setLoading(false);
  }

  async function loadProviders() {
    const { data } = await supabase
      .from("videographers")
      .select("*")
      .order("created_at", { ascending: false });
    setProviders(data || []);
  }

  const total = providers?.length || 0;
  const approved = providers?.filter((item) => item.status === "approved").length || 0;
  const pending = providers?.filter((item) => item.status === "pending").length || 0;
  const rejected = providers?.filter((item) => item.status === "rejected").length || 0;

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; dot: string }> = {
      approved: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
      pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
      rejected: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
    };
    return statusMap[status] || statusMap.pending;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading Admin Dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
              Admin Dashboard
            </h1>
            <p className="text-slate-600 mt-1">Manage providers and approvals</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/enquiries"
              className="rounded-2xl bg-blue-600 hover:bg-blue-700 px-6 py-2.5 text-white font-semibold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              View Enquiries
            </Link>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/login";
              }}
              className="rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 px-6 py-2.5 text-slate-700 font-semibold transition-all duration-200 hover:shadow-md"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <p className="text-sm font-medium text-slate-500">Total Providers</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{total}</p>
          </div>
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <p className="text-sm font-medium text-slate-500">Approved</p>
            <p className="text-3xl font-bold text-emerald-600 mt-1">{approved}</p>
          </div>
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <p className="text-sm font-medium text-slate-500">Pending</p>
            <p className="text-3xl font-bold text-amber-600 mt-1">{pending}</p>
          </div>
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <p className="text-sm font-medium text-slate-500">Rejected</p>
            <p className="text-3xl font-bold text-red-600 mt-1">{rejected}</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Search Providers
              </label>
              <input
                placeholder="Search by provider name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Filter by Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition appearance-none"
              >
                <option value="all">All Providers</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Providers Grid */}
        <h2 className="text-2xl font-bold text-slate-900 mb-6">All Providers</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers
            .filter((provider) => {
              const matchName = provider.name
                .toLowerCase()
                .includes(search.toLowerCase());
              const matchStatus = status === "all" || provider.status === status;
              return matchName && matchStatus;
            })
            .map((provider) => {
              const statusBadge = getStatusBadge(provider.status);
              return (
                <div
                  key={provider.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="text-center">
                    <img
                      src={provider.profile_image || "/default-profile.png"}
                      alt={provider.name}
                      className="mx-auto h-28 w-28 rounded-2xl object-cover border-2 border-slate-200"
                    />
                    <h3 className="mt-4 text-xl font-bold text-slate-900">
                      {provider.name}
                    </h3>
                    <p className="text-slate-600">{provider.category}</p>
                    {provider.district && (
                      <p className="text-slate-500 text-sm flex items-center justify-center gap-1 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {provider.district}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-center">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                      <span className={`w-2 h-2 rounded-full ${statusBadge.dot}`}></span>
                      {provider.status || "pending"}
                    </span>
                  </div>

                  <Link
                    href={`/admin/provider/${provider.id}`}
                    target="_blank"
                    className="mt-4 block rounded-2xl bg-blue-600 hover:bg-blue-700 py-3 text-center text-white font-semibold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    View Profile
                  </Link>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <form action="/api/admin/approve" method="POST" className="w-full">
                      <input type="hidden" name="id" value={provider.id} />
                      <button
                        type="submit"
                        className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 text-white font-semibold text-sm transition-all duration-200 hover:shadow-md"
                      >
                        Approve
                      </button>
                    </form>

                    <form action="/api/admin/reject" method="POST" className="w-full">
                      <input type="hidden" name="id" value={provider.id} />
                      <button
                        type="submit"
                        className="w-full rounded-xl bg-red-600 hover:bg-red-700 py-2.5 text-white font-semibold text-sm transition-all duration-200 hover:shadow-md"
                      >
                        Reject
                      </button>
                    </form>

                    <form action="/api/admin/delete" method="POST" className="w-full">
                      <input type="hidden" name="id" value={provider.id} />
                      <button
                        type="submit"
                        className="w-full rounded-xl bg-slate-600 hover:bg-slate-700 py-2.5 text-white font-semibold text-sm transition-all duration-200 hover:shadow-md"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
        </div>

        {providers.filter((provider) => {
          const matchName = provider.name.toLowerCase().includes(search.toLowerCase());
          const matchStatus = status === "all" || provider.status === status;
          return matchName && matchStatus;
        }).length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-12 max-w-md mx-auto">
              <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-slate-700 mb-1">No providers found</h3>
              <p className="text-slate-500">Try adjusting your search or filter</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
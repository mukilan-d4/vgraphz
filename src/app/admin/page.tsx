"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Provider {
  id: number;
  name: string;
  email: string;
  phone: string;
  category: string;
  district: string;
  status: string;
  approved: boolean;
  created_at: string;
  profile_image?: string;
  user_id?: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

  async function checkAdminAndLoad() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login");
        return;
      }

      // Check if user is admin (you can modify this check)
      const { data: adminCheck } = await supabase
        .from("admins")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!adminCheck) {
        setIsAdmin(false);
        setError("Unauthorized access");
        setLoading(false);
        return;
      }

      setIsAdmin(true);
      await loadProviders();
    } catch (err) {
      console.error(err);
      setError("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }

  async function loadProviders() {
    try {
      const { data, error } = await supabase
        .from("videographers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProviders(data || []);
    } catch (err: any) {
      console.error("Load providers error:", err);
      setError(err.message);
    }
  }

  async function handleApprove(id: number) {
    setProcessingId(id);
    setError("");
    setSuccess("");

    try {
      const { error } = await supabase
        .from("videographers")
        .update({ 
          status: "approved", 
          approved: true 
        })
        .eq("id", id);

      if (error) throw error;

      setSuccess(`Provider approved successfully`);
      await loadProviders();
    } catch (err: any) {
      console.error("Approve error:", err);
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject(id: number) {
    setProcessingId(id);
    setError("");
    setSuccess("");

    try {
      const { error } = await supabase
        .from("videographers")
        .update({ 
          status: "rejected", 
          approved: false 
        })
        .eq("id", id);

      if (error) throw error;

      setSuccess(`Provider rejected`);
      await loadProviders();
    } catch (err: any) {
      console.error("Reject error:", err);
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this provider?")) return;

    setProcessingId(id);
    setError("");
    setSuccess("");

    try {
      const { error } = await supabase
        .from("videographers")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setSuccess(`Provider deleted successfully`);
      await loadProviders();
    } catch (err: any) {
      console.error("Delete error:", err);
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Unauthorized</h2>
          <p className="mt-2 text-slate-600">You don't have permission to access this page</p>
          <Link href="/" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            ← Back to Home
          </Link>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-4 text-green-700">
            {success}
          </div>
        )}

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Provider</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Category</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Location</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {providers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                      No providers found
                    </td>
                  </tr>
                ) : (
                  providers.map((provider) => (
                    <tr key={provider.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {provider.profile_image ? (
                            <img 
                              src={provider.profile_image} 
                              alt={provider.name}
                              className="w-10 h-10 rounded-full object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                              {provider.name?.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-slate-900">{provider.name}</p>
                            <p className="text-xs text-slate-500">{provider.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                          {provider.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{provider.district}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          provider.status === "approved" 
                            ? "bg-green-50 text-green-700" 
                            : provider.status === "rejected"
                            ? "bg-red-50 text-red-700"
                            : "bg-yellow-50 text-yellow-700"
                        }`}>
                          {provider.status || "pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          {provider.status !== "approved" && (
                            <button
                              onClick={() => handleApprove(provider.id)}
                              disabled={processingId === provider.id}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-50"
                            >
                              {processingId === provider.id ? "..." : "Approve"}
                            </button>
                          )}
                          {provider.status !== "rejected" && provider.status !== "approved" && (
                            <button
                              onClick={() => handleReject(provider.id)}
                              disabled={processingId === provider.id}
                              className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-50"
                            >
                              {processingId === provider.id ? "..." : "Reject"}
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(provider.id)}
                            disabled={processingId === provider.id}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-50"
                          >
                            {processingId === provider.id ? "..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
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
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

  async function checkAdminAndLoad() {
    try {
      setCheckingAdmin(true);
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error("No user found:", userError);
        router.push("/login");
        return;
      }

      console.log("Current user ID:", user.id);

      // Check if user is admin - using a simpler query without .single()
      const { data: adminData, error: adminError } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", user.id);

      console.log("Admin check result:", adminData, adminError);

      if (adminError) {
        console.error("Admin check error:", adminError);
        setError("Error checking admin status");
        setIsAdmin(false);
        setCheckingAdmin(false);
        return;
      }

      // If we got data back, user is admin
      if (adminData && adminData.length > 0) {
        console.log("User is admin!");
        setIsAdmin(true);
        await loadProviders();
      } else {
        console.log("User is NOT admin");
        setIsAdmin(false);
        setError("You don't have admin permissions. Please contact the administrator.");
      }
      
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
      setCheckingAdmin(false);
    }
  }

  async function loadProviders() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("videographers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Load providers error:", error);
        setError(error.message);
        return;
      }
      
      setProviders(data || []);
      console.log("Loaded providers:", data?.length || 0);
    } catch (err: any) {
      console.error("Load providers error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
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

      if (error) {
        console.error("Approve error:", error);
        throw error;
      }

      setSuccess(`Provider approved successfully`);
      await loadProviders();
    } catch (err: any) {
      console.error("Approve error:", err);
      setError(err.message || "Failed to approve");
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

      if (error) {
        console.error("Reject error:", error);
        throw error;
      }

      setSuccess(`Provider rejected`);
      await loadProviders();
    } catch (err: any) {
      console.error("Reject error:", err);
      setError(err.message || "Failed to reject");
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

      if (error) {
        console.error("Delete error:", error);
        throw error;
      }

      setSuccess(`Provider deleted successfully`);
      await loadProviders();
    } catch (err: any) {
      console.error("Delete error:", err);
      setError(err.message || "Failed to delete");
    } finally {
      setProcessingId(null);
    }
  }

  if (checkingAdmin || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-slate-600 font-medium">
            {checkingAdmin ? "Checking permissions..." : "Loading providers..."}
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white rounded-3xl shadow-sm border border-slate-200">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-slate-900">Access Denied</h2>
          <p className="mt-2 text-slate-600">{error || "You don't have permission to access this page"}</p>
          <Link href="/" className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition">
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
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-600 text-sm mt-1">Manage providers and content</p>
          </div>
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Home
          </Link>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 flex items-center gap-2">
            <span>❌</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 flex items-center gap-2">
            <span>✅</span>
            <span>{success}</span>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="font-semibold text-slate-700">Total Providers: {providers.length}</span>
            <button 
              onClick={() => loadProviders()} 
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Refresh
            </button>
          </div>
          
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
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : null}
                          <div>
                            <p className="font-semibold text-slate-900">{provider.name || "Unnamed"}</p>
                            <p className="text-xs text-slate-500">{provider.email || "No email"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                          {provider.category || "Uncategorized"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{provider.district || "N/A"}</td>
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
                              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                            >
                              {processingId === provider.id ? "..." : "Approve"}
                            </button>
                          )}
                          {provider.status !== "rejected" && provider.status !== "approved" && (
                            <button
                              onClick={() => handleReject(provider.id)}
                              disabled={processingId === provider.id}
                              className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                            >
                              {processingId === provider.id ? "..." : "Reject"}
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(provider.id)}
                            disabled={processingId === provider.id}
                            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
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
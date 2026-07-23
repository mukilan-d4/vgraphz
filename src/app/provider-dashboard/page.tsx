"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ProviderDashboard() {
  const [provider, setProvider] = useState<any>(null);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data: providerData, error: providerError } = await supabase
      .from("videographers")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    console.log("Provider Data:", providerData);
    console.log("Provider Error:", JSON.stringify(providerError, null, 2));

    if (providerError) {
      console.error("Error loading provider:", JSON.stringify(providerError, null, 2));
      setLoading(false);
      return;
    }

    if (!providerData) {
      console.log("No provider profile found for this user");
      setLoading(false);
      return;
    }

    setProvider(providerData);

    const { data: enquiryData, error: enquiryError } = await supabase
      .from("enquiries")
      .select("*")
      .eq("provider_id", providerData.id)
      .order("created_at", { ascending: false });

    console.log("Enquiries:", enquiryData);
    console.log("Enquiry Error:", enquiryError);

    setEnquiries(enquiryData || []);
    setLoading(false);
  }

  // Change password function - NO EMAIL REQUIRED
  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMessage("");
    setPasswordError("");

    if (newPassword.length < 8) {
      setPasswordError("Password must contain at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setUpdatingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setPasswordError(error.message);
      } else {
        setPasswordMessage("✅ Password updated successfully!");
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordForm(false);
        setTimeout(() => setPasswordMessage(""), 3000);
      }
    } catch (err: any) {
      setPasswordError(err.message || "Failed to update password");
    }

    setUpdatingPassword(false);
  }

  // Show loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  // Show no profile state
  if (!provider) {
    return (
      <main className="min-h-screen bg-slate-50 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-12 text-center">
            <div className="mx-auto w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No Profile Found</h2>
            <p className="text-slate-600 mb-6">You haven't created a provider profile yet.</p>
            <Link
              href="/join-provider"
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 px-6 py-3 text-white font-semibold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your Profile
            </Link>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/login";
              }}
              className="mt-4 block w-full rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 px-6 py-3 text-slate-700 font-semibold transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
              Dashboard
            </h1>
            <p className="text-slate-600 mt-1">Manage your profile and enquiries</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 px-6 py-2.5 text-slate-700 font-semibold transition-all duration-200 hover:shadow-md"
            >
              🔑 Change Password
            </button>
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

        {/* Change Password Form */}
        {showPasswordForm && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  New Password *
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 8 characters)"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
                  required
                  minLength={8}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
                  required
                />
              </div>
              {passwordError && (
                <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
                  <p className="text-red-600 text-sm font-medium">{passwordError}</p>
                </div>
              )}
              {passwordMessage && (
                <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
                  <p className="text-green-600 text-sm font-medium">{passwordMessage}</p>
                </div>
              )}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={updatingPassword}
                  className="rounded-2xl bg-blue-600 hover:bg-blue-700 px-6 py-3 text-white font-semibold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updatingPassword ? "Updating..." : "Update Password"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setNewPassword("");
                    setConfirmPassword("");
                    setPasswordMessage("");
                    setPasswordError("");
                  }}
                  className="rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 px-6 py-3 text-slate-700 font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <img
              src={provider.profile_image || "/default-profile.png"}
              alt={provider.name}
              className="h-24 w-24 rounded-2xl object-cover border-2 border-slate-200"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900">
                Welcome, {provider.name}! 👋
              </h2>
              <p className="text-slate-600">{provider.category}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                  provider.status === "approved" 
                    ? "bg-emerald-50 text-emerald-700" 
                    : provider.status === "rejected"
                    ? "bg-red-50 text-red-700"
                    : "bg-amber-50 text-amber-700"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    provider.status === "approved" 
                      ? "bg-emerald-500" 
                      : provider.status === "rejected"
                      ? "bg-red-500"
                      : "bg-amber-500"
                  }`}></span>
                  {provider.status === "approved" ? "✅ Approved" : 
                   provider.status === "rejected" ? "❌ Rejected" : 
                   "⏳ Pending Approval"}
                </span>
                {provider.district && (
                  <span className="text-slate-500 text-sm flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {provider.district}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href={`/providers/${provider.id}`}
              className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 px-6 py-3.5 text-white font-semibold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Public Profile
            </Link>
            <Link
              href={`/provider-edit/${provider.id}`}
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 px-6 py-3.5 text-slate-700 font-semibold transition-all duration-200 hover:shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Total Leads Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-8">
          <p className="text-sm font-medium text-slate-500">
            Total Leads
          </p>
          <p className="text-4xl font-bold text-blue-600 mt-2">
            {enquiries.length}
          </p>
          <p className="text-slate-500 mt-2">
            Leads received from customers
          </p>
        </div>

        {/* Enquiries Section */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Customer Leads</h2>
              <p className="text-slate-500 text-sm">Contact customers directly by phone or WhatsApp</p>
            </div>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              {enquiries.length} {enquiries.length === 1 ? "Lead" : "Leads"}
            </span>
          </div>

          {enquiries.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-slate-50 rounded-2xl p-8">
                <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-slate-700 mb-1">No leads yet</h3>
                <p className="text-slate-500">When customers enquire, they'll appear here</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {enquiries.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 hover:border-blue-200 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900">
                        {item.customer_name}
                      </h3>
                      
                      <div className="space-y-1.5 text-sm mt-2">
                        <p className="text-slate-600 flex items-center gap-2">
                          <span className="text-slate-400">📞</span>
                          {item.customer_phone}
                        </p>
                        {item.event_type && (
                          <p className="text-slate-600 flex items-center gap-2">
                            <span className="text-slate-400">🎬</span>
                            {item.event_type}
                          </p>
                        )}
                        {item.message && (
                          <p className="text-slate-600 bg-white rounded-xl px-4 py-2 border border-slate-200 mt-2">
                            {item.message}
                          </p>
                        )}
                        {item.created_at && (
                          <p className="text-slate-400 text-xs flex items-center gap-1 mt-2">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(item.created_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-row gap-3 sm:w-auto">
                      <a
                        href={`tel:${item.customer_phone}`}
                        className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-3 text-center font-semibold text-white transition-all duration-200 hover:shadow-md whitespace-nowrap"
                      >
                        📞 Call
                      </a>
                      <a
                        href={`https://wa.me/${item.customer_phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-6 py-3 text-center font-semibold text-white transition-all duration-200 hover:shadow-md whitespace-nowrap"
                      >
                        💬 WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
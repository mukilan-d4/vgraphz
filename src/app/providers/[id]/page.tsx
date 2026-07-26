"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

import {
  MapPin,
  Phone,
  MessageCircle,
  Send,
  User,
  Mail,
  Clock,
  ChevronUp,
  ChevronDown,
  Edit,
  Trash2,
  X,
  Check,
  Globe,
  FolderOpen,
  Award,
  Languages,
  Truck,
  CheckCircle,
  ArrowLeft
} from "lucide-react";

interface Review {
  id: string;
  provider_id: number;
  rater_id: string;
  review: string;
  created_at: string;
}

export default function ProviderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const providerId = params.id as string;

  const [provider, setProvider] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editingReviewText, setEditingReviewText] = useState("");
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [enquiryName, setEnquiryName] = useState("");
  const [enquiryPhone, setEnquiryPhone] = useState("");
  const [enquiryEvent, setEnquiryEvent] = useState("");
  const [enquiryRequirements, setEnquiryRequirements] = useState("");
  const [enquirySubmitting, setEnquirySubmitting] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState("");
  const [enquiryError, setEnquiryError] = useState("");
  
  const [showComments, setShowComments] = useState(true);

  useEffect(() => {
    loadData();
  }, [providerId]);

  function convertArray(value: any) {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    return String(value).split(",").map((x) => x.trim()).filter(Boolean);
  }

  async function loadData() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      const { data: providerData, error: providerError } = await supabase
        .from("videographers")
        .select("*")
        .eq("id", providerId)
        .single();

      if (providerError) {
        console.log(providerError);
        setProvider(null);
        return;
      }

      setProvider(providerData);

      if (user && providerData.user_id === user.id) {
        setIsOwnProfile(true);
      }

      const { data: reviewsData } = await supabase
        .from("reviews")
        .select("*")
        .eq("provider_id", Number(providerId))
        .order("created_at", { ascending: false });

      setReviews(reviewsData || []);
      setReviewCount(reviewsData?.length || 0);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const skills = convertArray(provider?.skills);
  const languages = convertArray(provider?.languages);

  async function handleSubmitReview() {
    if (isOwnProfile) {
      setError("You cannot review your own profile");
      return;
    }
    if (!reviewText.trim()) {
      setError("Please write a review");
      return;
    }

    try {
      setSubmitting(true);
      const { data, error } = await supabase
        .from("reviews")
        .insert({
          provider_id: Number(providerId),
          rater_id: currentUser?.id || null,
          review: reviewText.trim()
        })
        .select()
        .single();

      if (error) throw error;

      setReviews([data, ...reviews]);
      setReviewCount(reviewCount + 1);
      setReviewText("");
      setSuccess("Review submitted successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function startEditing(review: Review) {
    setEditingReviewId(review.id);
    setEditingReviewText(review.review);
  }

  async function handleEditReview(id: string) {
    if (!editingReviewText.trim()) return;
    const { error } = await supabase
      .from("reviews")
      .update({
        review: editingReviewText.trim()
      })
      .eq("id", id);

    if (error) {
      setError(error.message);
      return;
    }

    setReviews(
      reviews.map((r) =>
        r.id === id
          ? {
              ...r,
              review: editingReviewText.trim()
            }
          : r
      )
    );
    setEditingReviewId(null);
    setEditingReviewText("");
  }

  async function handleDeleteReview(id: string) {
    const ok = confirm("Delete this review?");
    if (!ok) return;
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id);

    if (error) {
      setError(error.message);
      return;
    }
    setReviews(reviews.filter((r) => r.id !== id));
    setReviewCount(reviewCount - 1);
  }

  // ✅ FIXED: Handle enquiry submission with fetch
  async function handleEnquirySubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!enquiryName || !enquiryPhone || !enquiryRequirements) {
      setEnquiryError("Please fill in all required fields");
      return;
    }

    try {
      setEnquirySubmitting(true);
      setEnquiryError("");
      setEnquirySuccess("");

      // ✅ Create FormData with correct field names
      const formData = new FormData();
      formData.append("provider_id", providerId);
      formData.append("customer_name", enquiryName);
      formData.append("customer_phone", enquiryPhone);
      formData.append("event_type", enquiryEvent);
      formData.append("message", enquiryRequirements);

      const response = await fetch("/api/enquiry", {
        method: "POST",
        body: formData,
      });

      if (response.redirected) {
        // ✅ Redirect to thanks page
        window.location.href = response.url;
        return;
      }

      const result = await response.json();
      if (result.error) {
        setEnquiryError(result.error);
      } else {
        setEnquirySuccess("Enquiry sent successfully!");
        setEnquiryName("");
        setEnquiryPhone("");
        setEnquiryEvent("");
        setEnquiryRequirements("");
        setShowEnquiryForm(false);
        
        setTimeout(() => {
          router.push("/thanks");
        }, 1000);
      }

    } catch (err: any) {
      setEnquiryError(err.message || "Failed to send enquiry");
    } finally {
      setEnquirySubmitting(false);
    }
  }

  function handleWhatsApp() {
    if (!provider?.phone) {
      alert("Phone number not available");
      return;
    }

    let phoneNumber = provider.phone.replace(/\s/g, '').replace(/-/g, '').replace(/\+/g, '');
    
    if (!phoneNumber.startsWith('91') && phoneNumber.length === 10) {
      phoneNumber = '91' + phoneNumber;
    }

    const defaultMessage = "Hello! I discovered your work on VgraphZ. Would love to connect and discuss my requirements.";
    const encodedMessage = encodeURIComponent(defaultMessage);
    
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
  }

  function handleCall() {
    if (provider?.phone) {
      window.location.href = `tel:${provider.phone}`;
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">Provider not found</h2>
          <Link href="/providers" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
            Browse Providers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">

      {/* ===== MOBILE-FRIENDLY HEADER ===== */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/providers" className="p-1.5 -ml-1.5 rounded-full hover:bg-slate-100 transition">
            <ArrowLeft size={22} className="text-slate-700" />
          </Link>
          <h1 className="text-lg font-bold text-slate-900 truncate flex-1">{provider.name}</h1>
          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 border border-green-200">
            <CheckCircle size={12} />
            Verified
          </span>
        </div>
      </div>

      {/* ===== PROFILE SECTION ===== */}
      <div className="px-4 pt-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Profile Header */}
          <div className="flex flex-col items-center pt-6 px-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-200 border-4 border-slate-200 shadow-sm">
              {provider.profile_image ? (
                <img
                  src={provider.profile_image}
                  alt={provider.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-slate-500">
                  {provider.name?.charAt(0)}
                </div>
              )}
            </div>

            <h2 className="mt-3 text-xl font-bold text-slate-900 text-center">
              {provider.name}
            </h2>
            <p className="text-blue-600 font-semibold text-sm">
              {provider.category}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-1.5 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {provider.district}
              </span>
              <span className="text-slate-300">•</span>
              <span>{reviewCount} {reviewCount === 1 ? 'Review' : 'Reviews'}</span>
              {provider.experience && (
                <>
                  <span className="text-slate-300">•</span>
                  <span>⭐ {provider.experience}Y</span>
                </>
              )}
            </div>
          </div>

          {/* ===== MOBILE ACTION BUTTONS ===== */}
          <div className="p-4 grid grid-cols-3 gap-2 border-t border-slate-100 mt-3">
            <button
              onClick={handleCall}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-xl transition-all duration-200 active:scale-95"
            >
              <Phone size={16} />
              Call
            </button>
            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2.5 rounded-xl transition-all duration-200 active:scale-95"
            >
              <MessageCircle size={16} />
              WhatsApp
            </button>
            <button
              onClick={() => setShowEnquiryForm(!showEnquiryForm)}
              className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2.5 rounded-xl transition-all duration-200 active:scale-95"
            >
              <Send size={16} />
              Enquiry
            </button>
          </div>

          {/* ===== ENQUIRY FORM - FIXED ===== */}
          {showEnquiryForm && !isOwnProfile && (
            <form
              onSubmit={handleEnquirySubmit}
              className="px-4 pb-4 bg-slate-50 border-t border-slate-200"
            >
              <div className="pt-4 space-y-3">
                <input
                  type="text"
                  placeholder="Your Name *"
                  value={enquiryName}
                  onChange={(e) => setEnquiryName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={enquiryPhone}
                  onChange={(e) => setEnquiryPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                  required
                />
                <input
                  type="text"
                  placeholder="Event Type (e.g., Wedding)"
                  value={enquiryEvent}
                  onChange={(e) => setEnquiryEvent(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                />
                <textarea
                  placeholder="Your Requirements *"
                  value={enquiryRequirements}
                  onChange={(e) => setEnquiryRequirements(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 resize-none"
                  rows={3}
                  required
                />
                <button
                  type="submit"
                  disabled={enquirySubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 active:scale-95"
                >
                  {enquirySubmitting ? "Sending..." : "Send Enquiry"}
                </button>
                {enquiryError && <p className="text-red-600 text-sm text-center">{enquiryError}</p>}
                {enquirySuccess && <p className="text-green-600 text-sm text-center">{enquirySuccess}</p>}
              </div>
            </form>
          )}

          {/* Show message if own profile */}
          {showEnquiryForm && isOwnProfile && (
            <div className="px-4 pb-4 bg-slate-50 border-t border-slate-200">
              <div className="pt-4 text-center text-sm text-slate-500">
                You cannot send enquiry to your own profile
              </div>
            </div>
          )}
        </div>

        {/* ===== DETAILS CARDS ===== */}
        <div className="mt-4 space-y-3">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-1.5">About</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {provider.about || "No description provided."}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <MapPin size={16} className="text-blue-600" /> Location
            </h3>
            <p className="text-slate-600 text-sm">
              {provider.location || provider.district || "Not specified"}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {skills.length ? (
                skills.map((skill: string, i: number) => (
                  <span
                    key={i}
                    className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-slate-500 text-sm">No skills listed</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Award size={16} className="text-amber-500" /> Experience
            </h3>
            <p className="text-slate-600 text-sm">{provider.experience || "0"} Years</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
              <Languages size={16} className="text-emerald-500" /> Languages
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {languages.length ? (
                languages.map((lang: string, i: number) => (
                  <span
                    key={i}
                    className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {lang}
                  </span>
                ))
              ) : (
                <p className="text-slate-500 text-sm">No languages listed</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
              <Globe size={16} className="text-blue-600" /> Online
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {provider.website && (
                <a href={provider.website} target="_blank" rel="noopener noreferrer" className="bg-slate-100 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 hover:bg-slate-200 transition">
                  Website
                </a>
              )}
              {provider.youtube && (
                <a href={provider.youtube} target="_blank" rel="noopener noreferrer" className="bg-red-50 px-3 py-1.5 rounded-full text-xs font-medium text-red-600 hover:bg-red-100 transition">
                  YouTube
                </a>
              )}
              {provider.instagram && (
                <a href={provider.instagram} target="_blank" rel="noopener noreferrer" className="bg-pink-50 px-3 py-1.5 rounded-full text-xs font-medium text-pink-600 hover:bg-pink-100 transition">
                  Instagram
                </a>
              )}
              {provider.portfolio && (
                <a href={provider.portfolio} target="_blank" rel="noopener noreferrer" className="bg-purple-50 px-3 py-1.5 rounded-full text-xs font-medium text-purple-600 hover:bg-purple-100 transition">
                  Portfolio
                </a>
              )}
              {!provider.website && !provider.youtube && !provider.instagram && !provider.portfolio && (
                <p className="text-slate-500 text-sm">No links</p>
              )}
            </div>
          </div>

          {(provider.delivery || provider.delivery_time) && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Truck size={16} className="text-blue-600" /> Delivery
              </h3>
              <p className="text-slate-600 text-sm">{provider.delivery || provider.delivery_time}</p>
            </div>
          )}
        </div>

        {/* ===== REVIEWS SECTION ===== */}
        <div className="mt-4 bg-white rounded-2xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">
              Reviews ({reviewCount})
            </h3>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 transition text-sm"
            >
              <span className="text-xs font-medium">
                {showComments ? 'Hide' : 'Show'}
              </span>
              {showComments ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>

          {/* Write Review - Always Visible */}
          {!isOwnProfile && (
            <div className="mt-3">
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your review..."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 resize-none"
                rows={3}
              />
              {error && <p className="text-red-600 text-xs mt-1.5">{error}</p>}
              {success && <p className="text-green-600 text-xs mt-1.5">{success}</p>}
              <button
                onClick={handleSubmitReview}
                disabled={submitting}
                className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-xl transition-all duration-200 active:scale-95"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          )}

          {isOwnProfile && (
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-700 text-xs text-center">
              You cannot review your own profile
            </div>
          )}

          {/* Comments */}
          {showComments && (
            <div className="mt-4 space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
              {reviews.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-4">No reviews yet</p>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="border-b border-slate-100 pb-3 last:border-0">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                        <User size={14} className="text-blue-600" />
                      </div>
                      <span className="font-semibold text-slate-900 text-sm">User</span>
                      <span className="text-xs text-slate-400 ml-auto">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {editingReviewId === review.id ? (
                      <div className="mt-2">
                        <textarea
                          value={editingReviewText}
                          onChange={(e) => setEditingReviewText(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                          rows={2}
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleEditReview(review.id)}
                            disabled={submitting}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition active:scale-95"
                          >
                            <Check size={14} className="inline mr-1" /> Save
                          </button>
                          <button
                            onClick={() => setEditingReviewId(null)}
                            className="border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                          >
                            <X size={14} className="inline mr-1" /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="mt-1.5 text-slate-700 text-sm">{review.review}</p>
                        <div className="flex gap-3 mt-1.5">
                          <button
                            onClick={() => startEditing(review)}
                            className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center gap-1 transition"
                          >
                            <Edit size={13} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="text-red-600 hover:text-red-800 text-xs font-medium flex items-center gap-1 transition"
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* ===== BOTTOM FLOATING ACTION BAR ===== */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 shadow-lg z-50">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleCall}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 active:scale-95"
          >
            <Phone size={18} />
            Call Now
          </button>
          <button
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 active:scale-95"
          >
            <MessageCircle size={18} />
            WhatsApp
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

    </div>
  );
}
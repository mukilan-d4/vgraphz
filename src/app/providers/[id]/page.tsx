"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
  CheckCircle
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

      console.log("PROVIDER DATA:", providerData);

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
    if (!currentUser) {
      setError("Please login to leave a review");
      return;
    }
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
          rater_id: currentUser.id,
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

  async function handleEnquirySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!enquiryName || !enquiryPhone || !enquiryRequirements) {
      setEnquiryError("Please fill required fields");
      return;
    }

    try {
      setEnquirySubmitting(true);
      const { error } = await supabase
        .from("enquiries")
        .insert({
          provider_id: Number(providerId),
          rater_id: currentUser?.id || null,
          name: enquiryName,
          phone: enquiryPhone,
          event_type: enquiryEvent,
          requirements: enquiryRequirements
        });

      if (error) throw error;

      setEnquirySuccess("Enquiry sent successfully");
      setEnquiryName("");
      setEnquiryPhone("");
      setEnquiryEvent("");
      setEnquiryRequirements("");
    } catch (err: any) {
      setEnquiryError(err.message);
    } finally {
      setEnquirySubmitting(false);
    }
  }

  function handleWhatsApp() {
    if (provider?.phone) {
      window.open(`https://wa.me/${provider.phone}`, "_blank");
    }
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
    <div className="min-h-screen bg-slate-50">

      {/* HEADER - Clean card style matching featured cards */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-8">

          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">

            {/* Profile Image - Circular like featured cards */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-200 border-4 border-slate-200">
                {provider.profile_image ? (
                  <img
                    src={provider.profile_image}
                    alt={provider.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-slate-500">
                    {provider.name?.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                <h1 className="text-3xl font-bold text-slate-900">
                  {provider.name}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  <CheckCircle size={14} className="text-green-600" />
                  Verified
                </span>
              </div>

              <p className="text-blue-600 font-semibold text-lg mt-1">
                {provider.category}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2 text-sm text-slate-600">
                <span className="flex items-center gap-1">
                  <MapPin size={16} />
                  {provider.district}
                </span>
                <span>•</span>
                <span>{reviewCount} {reviewCount === 1 ? 'Review' : 'Reviews'}</span>
                {provider.experience && (
                  <>
                    <span>•</span>
                    <span>⭐ {provider.experience} Years</span>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons - Clean style */}
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <button
                onClick={handleCall}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:shadow-md"
              >
                <Phone size={18} />
                Call Now
              </button>
              <button
                onClick={handleWhatsApp}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:shadow-md"
              >
                <MessageCircle size={18} />
                WhatsApp
              </button>
              <button
                onClick={() => setShowEnquiryForm(!showEnquiryForm)}
                className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:shadow-md"
              >
                <Send size={18} />
                Enquiry
              </button>
            </div>
          </div>

          {/* Enquiry Form */}
          {showEnquiryForm && (
            <form
              onSubmit={handleEnquirySubmit}
              className="mt-6 bg-slate-50 p-5 rounded-2xl border border-slate-200 max-w-2xl mx-auto md:mx-0"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  placeholder="Your Name *"
                  value={enquiryName}
                  onChange={(e) => setEnquiryName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                />
                <input
                  placeholder="Phone Number *"
                  value={enquiryPhone}
                  onChange={(e) => setEnquiryPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                />
                <input
                  placeholder="Event Type"
                  value={enquiryEvent}
                  onChange={(e) => setEnquiryEvent(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                />
                <button
                  type="submit"
                  disabled={enquirySubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 hover:shadow-md"
                >
                  {enquirySubmitting ? "Sending..." : "Send Enquiry"}
                </button>
              </div>
              <textarea
                placeholder="Your Requirements *"
                value={enquiryRequirements}
                onChange={(e) => setEnquiryRequirements(e.target.value)}
                className="w-full mt-3 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 resize-none"
                rows={2}
              />
              {enquiryError && (
                <p className="text-red-600 text-sm mt-2">{enquiryError}</p>
              )}
              {enquirySuccess && (
                <p className="text-green-600 text-sm mt-2">{enquirySuccess}</p>
              )}
            </form>
          )}
        </div>
      </div>

      {/* MAIN CONTENT - Grid layout with clean cards */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* About */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">About</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {provider.about || "No description provided."}
            </p>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
              <MapPin size={18} className="text-blue-600" />
              Location
            </h2>
            <p className="text-slate-600 text-sm">
              {provider.location || provider.district || "Not specified"}
            </p>
            {provider.state && (
              <p className="text-slate-500 text-sm mt-1">State: {provider.state}</p>
            )}
          </div>

          {/* Skills */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Skills & Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {skills.length ? (
                skills.map((skill: string, i: number) => (
                  <span
                    key={i}
                    className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-slate-500 text-sm">No skills listed</p>
              )}
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
              <Award size={18} className="text-amber-500" />
              Experience
            </h2>
            <p className="text-slate-600 text-sm">
              {provider.experience || "0"} Years
            </p>
          </div>

          {/* Languages */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
              <Languages size={18} className="text-emerald-500" />
              Languages
            </h2>
            <div className="flex flex-wrap gap-2">
              {languages.length ? (
                languages.map((lang: string, i: number) => (
                  <span
                    key={i}
                    className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {lang}
                  </span>
                ))
              ) : (
                <p className="text-slate-500 text-sm">No languages listed</p>
              )}
            </div>
          </div>

          {/* Online Presence */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
              <Globe size={18} className="text-blue-600" />
              Online Presence
            </h2>
            <div className="flex flex-wrap gap-2">
              {provider.website && (
                <a
                  href={provider.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-sm font-medium transition"
                >
                  Website
                </a>
              )}
              {provider.youtube && (
                <a
                  href={provider.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-xl text-sm font-medium transition"
                >
                  YouTube
                </a>
              )}
              {provider.instagram && (
                <a
                  href={provider.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-pink-50 hover:bg-pink-100 text-pink-600 px-3 py-1.5 rounded-xl text-sm font-medium transition"
                >
                  Instagram
                </a>
              )}
              {provider.portfolio && (
                <a
                  href={provider.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-purple-50 hover:bg-purple-100 text-purple-600 px-3 py-1.5 rounded-xl text-sm font-medium transition"
                >
                  Portfolio
                </a>
              )}
              {!provider.website && !provider.youtube && !provider.instagram && !provider.portfolio && (
                <p className="text-slate-500 text-sm">No online presence listed</p>
              )}
            </div>
          </div>

          {/* Delivery */}
          {(provider.delivery || provider.delivery_time) && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
                <Truck size={18} className="text-blue-600" />
                Delivery
              </h2>
              <p className="text-slate-600 text-sm">
                {provider.delivery || provider.delivery_time}
              </p>
            </div>
          )}

        </div>

        {/* REVIEWS SECTION */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900">
            Reviews ({reviewCount})
          </h2>

          {currentUser && !isOwnProfile && (
            <div className="mt-4">
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your review..."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 resize-none"
                rows={4}
              />
              {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
              {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
              <button
                onClick={handleSubmitReview}
                disabled={submitting}
                className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:shadow-md"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          )}

          {currentUser && isOwnProfile && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-700 text-sm">
              You cannot review your own profile
            </div>
          )}

          {!currentUser && (
            <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-500 text-sm">
              Please login to leave a review
            </div>
          )}

          <div className="mt-6 space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {reviews.length === 0 ? (
              <p className="text-slate-500 text-sm">No reviews yet</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="border-b border-slate-100 pb-4 last:border-0">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <User size={16} className="text-blue-600" />
                    </div>
                    <span className="font-semibold text-slate-900 text-sm">
                      {review.rater_id === currentUser?.id ? "You" : "User"}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                    {review.rater_id === currentUser?.id && (
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        Your Review
                      </span>
                    )}
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
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
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
                      <p className="mt-2 text-slate-700 text-sm">{review.review}</p>
                      {review.rater_id === currentUser?.id && (
                        <div className="flex gap-4 mt-2">
                          <button
                            onClick={() => startEditing(review)}
                            className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center gap-1 transition"
                          >
                            <Edit size={14} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="text-red-600 hover:text-red-800 text-xs font-medium flex items-center gap-1 transition"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
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
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
  rater_name?: string;
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
  const [reviewerName, setReviewerName] = useState("");
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
    if (isOwnProfile) {
      setError("You cannot review your own profile");
      return;
    }
    if (!reviewText.trim()) {
      setError("Please write a review");
      return;
    }
    if (!reviewerName.trim()) {
      setError("Please enter your name");
      return;
    }

    try {
      setSubmitting(true);
      const { data, error } = await supabase
        .from("reviews")
        .insert({
          provider_id: Number(providerId),
          rater_id: currentUser?.id || null,
          rater_name: reviewerName.trim(),
          review: reviewText.trim()
        })
        .select()
        .single();

      if (error) throw error;

      setReviews([data, ...reviews]);
      setReviewCount(reviewCount + 1);
      setReviewText("");
      setReviewerName("");
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

      {/* PROFILE CARD */}
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Profile Header */}
          <div className="flex flex-col items-center pt-8 px-6">
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

            <div className="mt-4 flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">
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

            <div className="flex flex-wrap items-center justify-center gap-3 mt-2 text-sm text-slate-600">
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

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap justify-center gap-3 w-full">
              <button
                onClick={handleCall}
                className="flex-1 min-w-[100px] flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:shadow-md"
              >
                <Phone size={18} />
                Call Now
              </button>
              <button
                onClick={handleWhatsApp}
                className="flex-1 min-w-[100px] flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:shadow-md"
              >
                <MessageCircle size={18} />
                WhatsApp
              </button>
              <button
                onClick={() => setShowEnquiryForm(!showEnquiryForm)}
                className="flex-1 min-w-[100px] flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:shadow-md"
              >
                <Send size={18} />
                Enquiry
              </button>
            </div>

            {/* Enquiry Form - Button centered below textarea */}
            {showEnquiryForm && (
              <form
                onSubmit={handleEnquirySubmit}
                className="mt-4 w-full bg-slate-50 p-4 rounded-2xl border border-slate-200"
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
                </div>

                <textarea
                  placeholder="Your Requirements *"
                  value={enquiryRequirements}
                  onChange={(e) => setEnquiryRequirements(e.target.value)}
                  className="w-full mt-3 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 resize-none"
                  rows={2}
                />

                {/* Button centered below textarea */}
                <div className="flex justify-center mt-3">
                  <button
                    type="submit"
                    disabled={enquirySubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2.5 rounded-xl transition-all duration-200 hover:shadow-md"
                  >
                    {enquirySubmitting ? "Sending..." : "Send Enquiry"}
                  </button>
                </div>

                {enquiryError && (
                  <p className="text-red-600 text-sm mt-2 text-center">{enquiryError}</p>
                )}
                {enquirySuccess && (
                  <p className="text-green-600 text-sm mt-2 text-center">{enquirySuccess}</p>
                )}
              </form>
            )}
          </div>

          {/* Details Grid */}
          <div className="px-6 pb-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="bg-slate-50 rounded-2xl p-4">
                <h2 className="text-sm font-semibold text-slate-700 mb-1">About</h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {provider.about || "No description provided."}
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4">
                <h2 className="text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <MapPin size={16} className="text-blue-600" /> Location
                </h2>
                <p className="text-slate-600 text-sm">
                  {provider.location || provider.district || "Not specified"}
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4">
                <h2 className="text-sm font-semibold text-slate-700 mb-2">Skills</h2>
                <div className="flex flex-wrap gap-1.5">
                  {skills.length ? (
                    skills.map((skill: string, i: number) => (
                      <span
                        key={i}
                        className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-slate-500 text-sm">No skills listed</p>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4">
                <h2 className="text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Award size={16} className="text-amber-500" /> Experience
                </h2>
                <p className="text-slate-600 text-sm">
                  {provider.experience || "0"} Years
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4">
                <h2 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                  <Languages size={16} className="text-emerald-500" /> Languages
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {languages.length ? (
                    languages.map((lang: string, i: number) => (
                      <span
                        key={i}
                        className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-medium"
                      >
                        {lang}
                      </span>
                    ))
                  ) : (
                    <p className="text-slate-500 text-sm">No languages listed</p>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4">
                <h2 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                  <Globe size={16} className="text-blue-600" /> Online
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {provider.website && (
                    <a href={provider.website} target="_blank" rel="noopener noreferrer" className="bg-white px-2.5 py-1 rounded-full text-xs font-medium text-blue-600 hover:bg-blue-50 transition border border-slate-200">
                      Website
                    </a>
                  )}
                  {provider.youtube && (
                    <a href={provider.youtube} target="_blank" rel="noopener noreferrer" className="bg-white px-2.5 py-1 rounded-full text-xs font-medium text-red-600 hover:bg-red-50 transition border border-slate-200">
                      YouTube
                    </a>
                  )}
                  {provider.instagram && (
                    <a href={provider.instagram} target="_blank" rel="noopener noreferrer" className="bg-white px-2.5 py-1 rounded-full text-xs font-medium text-pink-600 hover:bg-pink-50 transition border border-slate-200">
                      Instagram
                    </a>
                  )}
                  {provider.portfolio && (
                    <a href={provider.portfolio} target="_blank" rel="noopener noreferrer" className="bg-white px-2.5 py-1 rounded-full text-xs font-medium text-purple-600 hover:bg-purple-50 transition border border-slate-200">
                      Portfolio
                    </a>
                  )}
                  {!provider.website && !provider.youtube && !provider.instagram && !provider.portfolio && (
                    <p className="text-slate-500 text-sm">No links</p>
                  )}
                </div>
              </div>

              {(provider.delivery || provider.delivery_time) && (
                <div className="bg-slate-50 rounded-2xl p-4">
                  <h2 className="text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Truck size={16} className="text-blue-600" /> Delivery
                  </h2>
                  <p className="text-slate-600 text-sm">
                    {provider.delivery || provider.delivery_time}
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* REVIEWS SECTION - Anyone can review */}
        <div className="mt-6 bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-900">
            Reviews ({reviewCount})
          </h2>

          {!isOwnProfile && (
            <div className="mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input
                  placeholder="Your Name *"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
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

          {isOwnProfile && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-700 text-sm">
              You cannot review your own profile
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
                      {review.rater_name || "User"}
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
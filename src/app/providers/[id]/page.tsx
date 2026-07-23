"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  MapPin, Phone, MessageCircle, Send, User, Calendar, 
  CheckCircle, Mail, Clock, ChevronDown, ChevronUp,
  Edit, Trash2, X, Check, Globe, FolderOpen, Award, Languages, Truck
} from "lucide-react";

interface Review {
  id: string;
  provider_id: number;
  rater_id: string;
  review: string;
  created_at: string;
}

interface Provider {
  id: number;
  name: string;
  email: string;
  category: string;
  district: string;
  about: string;
  profile_image: string;
  user_id: string;
  phone?: string;
  verified?: boolean;
  skills?: string[];
  website?: string;
  youtube?: string;
  portfolio?: string;
  instagram?: string;
  experience?: string;
  location?: string;
  languages?: string[];
  delivery?: string;
}

export default function ProviderDetailPage() {
  const params = useParams();
  const providerId = params.id as string;
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [provider, setProvider] = useState<Provider | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showReviewBox, setShowReviewBox] = useState(false);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editingReviewText, setEditingReviewText] = useState("");
  
  const [enquiryName, setEnquiryName] = useState("");
  const [enquiryPhone, setEnquiryPhone] = useState("");
  const [enquiryEvent, setEnquiryEvent] = useState("");
  const [enquiryRequirements, setEnquiryRequirements] = useState("");
  const [enquirySubmitting, setEnquirySubmitting] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState("");
  const [enquiryError, setEnquiryError] = useState("");

  useEffect(() => {
    if (providerId) {
      fetchData();
    }
  }, [providerId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      const { data: providerData, error: providerError } = await supabase
        .from("videographers")
        .select("*")
        .eq("id", parseInt(providerId))
        .maybeSingle();

      if (providerError) {
        console.error("Provider fetch error:", providerError);
        setError("Failed to load provider profile");
        return;
      }

      if (!providerData) {
        setError("Provider not found");
        return;
      }

      setProvider(providerData);
      if (user && providerData.user_id === user.id) {
        setIsOwnProfile(true);
      }

      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select("*")
        .eq("provider_id", parseInt(providerId))
        .order("created_at", { ascending: false });

      if (reviewsError) {
        console.error("Reviews fetch error:", reviewsError);
      } else {
        setReviews(reviewsData || []);
        setReviewCount(reviewsData?.length || 0);
      }

    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
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
      setError("");
      setSuccess("");

      const { data, error: insertError } = await supabase
        .from("reviews")
        .insert([{
          provider_id: parseInt(providerId),
          rater_id: currentUser.id,
          review: reviewText.trim(),
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      setSuccess("Review submitted!");
      setReviews([data, ...reviews]);
      setReviewCount(reviewCount + 1);
      setReviewText("");
      setShowReviewBox(false);
      setTimeout(() => setSuccess(""), 3000);

    } catch (err: any) {
      console.error("Submit error:", err);
      setError(err.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditReview = async (reviewId: string) => {
    if (!editingReviewText.trim()) {
      setError("Review cannot be empty");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const { error: updateError } = await supabase
        .from("reviews")
        .update({
          review: editingReviewText.trim(),
          updated_at: new Date().toISOString()
        })
        .eq("id", reviewId);

      if (updateError) throw updateError;

      setSuccess("Review updated successfully!");
      
      setReviews(reviews.map(r => 
        r.id === reviewId 
          ? { ...r, review: editingReviewText.trim() }
          : r
      ));
      
      setEditingReviewId(null);
      setEditingReviewText("");
      setTimeout(() => setSuccess(""), 3000);

    } catch (err: any) {
      console.error("Update error:", err);
      setError(err.message || "Failed to update review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const { error: deleteError } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId);

      if (deleteError) throw deleteError;

      setSuccess("Review deleted successfully!");
      setReviews(reviews.filter(r => r.id !== reviewId));
      setReviewCount(reviewCount - 1);
      
      setTimeout(() => setSuccess(""), 3000);

    } catch (err: any) {
      console.error("Delete error:", err);
      setError(err.message || "Failed to delete review");
    } finally {
      setSubmitting(false);
    }
  };

  const startEditing = (review: Review) => {
    setEditingReviewId(review.id);
    setEditingReviewText(review.review);
  };

  const cancelEditing = () => {
    setEditingReviewId(null);
    setEditingReviewText("");
    setError("");
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!enquiryName.trim() || !enquiryPhone.trim() || !enquiryRequirements.trim()) {
      setEnquiryError("Please fill in all required fields");
      return;
    }

    try {
      setEnquirySubmitting(true);
      setEnquiryError("");
      setEnquirySuccess("");

      const { error: insertError } = await supabase
        .from("enquiries")
        .insert([{
          provider_id: parseInt(providerId),
          rater_id: currentUser?.id || null,
          name: enquiryName.trim(),
          phone: enquiryPhone.trim(),
          event_type: enquiryEvent.trim() || null,
          requirements: enquiryRequirements.trim(),
        }]);

      if (insertError) throw insertError;

      setEnquirySuccess("Enquiry sent successfully!");
      setEnquiryName("");
      setEnquiryPhone("");
      setEnquiryEvent("");
      setEnquiryRequirements("");
      setShowEnquiryForm(false);
      setTimeout(() => setEnquirySuccess(""), 5000);

    } catch (err: any) {
      console.error("Enquiry error:", err);
      setEnquiryError(err.message || "Failed to send enquiry");
    } finally {
      setEnquirySubmitting(false);
    }
  };

  const handleCallNow = () => {
    if (provider?.phone) {
      window.location.href = `tel:${provider.phone}`;
    } else {
      alert("Phone number not available");
    }
  };

  const handleWhatsApp = () => {
    if (provider?.phone) {
      const message = `Hi, I'm interested in your services. Can you provide more information?`;
      window.open(`https://wa.me/${provider.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    } else {
      alert("Phone number not available");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error || "Provider not found"}</p>
          <button
            onClick={() => window.location.href = '/providers'}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Back to Providers
          </button>
        </div>
      </div>
    );
  }

  // Check if provider has any online presence
  const hasOnlinePresence = !!(provider.website || provider.youtube || provider.portfolio || provider.instagram);
  const hasLanguages = provider.languages && provider.languages.length > 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center flex-shrink-0">
              {provider.profile_image ? (
                <img
                  src={provider.profile_image}
                  alt={provider.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-slate-700">
                  {provider.name.charAt(0)}
                </span>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">{provider.name}</h1>
                {provider.verified && (
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
                    <CheckCircle size={12} /> Verified
                  </span>
                )}
              </div>
              <p className="text-slate-600 text-sm">{provider.category}</p>
              <div className="flex items-center gap-4 mt-1 flex-wrap">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin size={14} /> {provider.district}
                </span>
                <span className="text-xs text-slate-500">
                  {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 flex-shrink-0 ml-auto">
              <button
                onClick={handleCallNow}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 whitespace-nowrap"
              >
                <Phone size={15} /> Call Now
              </button>
              <button
                onClick={handleWhatsApp}
                className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 whitespace-nowrap"
              >
                <MessageCircle size={15} /> WhatsApp
              </button>
              <button
                onClick={() => setShowEnquiryForm(!showEnquiryForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 whitespace-nowrap"
              >
                {showEnquiryForm ? (
                  <>
                    <ChevronUp size={15} />
                    Close
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    Send Enquiry
                  </>
                )}
              </button>
            </div>
          </div>

          {showEnquiryForm && (
            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 animate-fadeIn ml-auto max-w-md">
              <h4 className="font-medium text-slate-900 text-sm mb-2">Send Enquiry</h4>
              <p className="text-xs text-slate-500 mb-3">
                Get in touch with {provider.name}
              </p>
              <form onSubmit={handleEnquirySubmit} className="space-y-3">
                <input
                  type="text"
                  value={enquiryName}
                  onChange={(e) => setEnquiryName(e.target.value)}
                  placeholder="Your Name *"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                  required
                />
                <input
                  type="tel"
                  value={enquiryPhone}
                  onChange={(e) => setEnquiryPhone(e.target.value)}
                  placeholder="Phone Number *"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                  required
                />
                <input
                  type="text"
                  value={enquiryEvent}
                  onChange={(e) => setEnquiryEvent(e.target.value)}
                  placeholder="Event Type (e.g., Wedding)"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                />
                <textarea
                  value={enquiryRequirements}
                  onChange={(e) => setEnquiryRequirements(e.target.value)}
                  placeholder="Your Requirements *"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                  rows={3}
                  required
                />
                {enquiryError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                    <p className="text-red-600 text-xs">{enquiryError}</p>
                  </div>
                )}
                {enquirySuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                    <p className="text-green-600 text-xs">{enquirySuccess}</p>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={enquirySubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {enquirySubmitting ? "Sending..." : <><Send size={14} /> Send</>}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* About */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">About</h2>
              <p className="text-slate-600 text-sm">{provider.about || "No description provided"}</p>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Skills & Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {provider.skills?.length ? (
                  provider.skills.map((skill, i) => (
                    <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm">No skills listed</p>
                )}
              </div>
            </div>

            {/* Online Presence */}
            {hasOnlinePresence && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Globe size={18} className="text-blue-600" /> Online Presence
                </h2>
                <div className="flex flex-wrap gap-3">
                  {provider.website && provider.website.trim() !== "" && (
                    <a
                      href={provider.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200"
                    >
                      <Globe size={16} /> Website
                    </a>
                  )}
                  {provider.youtube && provider.youtube.trim() !== "" && (
                    <a
                      href={provider.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      YouTube
                    </a>
                  )}
                  {provider.portfolio && provider.portfolio.trim() !== "" && (
                    <a
                      href={provider.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-600 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200"
                    >
                      <FolderOpen size={16} /> Portfolio
                    </a>
                  )}
                  {provider.instagram && provider.instagram.trim() !== "" && (
                    <a
                      href={provider.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-pink-50 hover:bg-pink-100 text-pink-600 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                      Instagram
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* Location */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <MapPin size={18} className="text-blue-600" /> Location
              </h2>
              <p className="text-slate-600 text-sm">{provider.location || provider.district || "Not specified"}</p>
            </div>

            {/* Experience */}
            {provider.experience && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Award size={18} className="text-blue-600" /> Experience
                </h2>
                <p className="text-slate-600 text-sm">{provider.experience} Years</p>
              </div>
            )}

            {/* Languages */}
            {hasLanguages && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Languages size={18} className="text-blue-600" /> Languages
                </h2>
                <div className="flex flex-wrap gap-2">
                  {provider.languages?.map((lang, i) => (
                    <span key={i} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery */}
            {provider.delivery && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Truck size={18} className="text-blue-600" /> Delivery
                </h2>
                <p className="text-slate-600 text-sm">{provider.delivery}</p>
              </div>
            )}
          </div>
        </div>

        {/* REVIEW BOX */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Reviews ({reviewCount})
            </h2>
          </div>

          {currentUser && !isOwnProfile ? (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <User size={16} className="text-blue-600" />
                </div>
                <span className="font-medium text-slate-900">Write your review</span>
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with this provider..."
                rows={4}
                className="w-full border rounded-xl p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                disabled={submitting}
              />
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2 mt-2">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 mt-2">
                  <p className="text-green-600 text-sm">{success}</p>
                </div>
              )}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleSubmitReview}
                  disabled={submitting || !reviewText.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-50 flex items-center gap-1"
                >
                  {submitting ? "Submitting..." : <><Send size={14} /> Submit Review</>}
                </button>
                <button
                  onClick={() => {
                    setReviewText("");
                    setError("");
                    setSuccess("");
                  }}
                  className="border border-slate-300 px-4 py-2 rounded-xl text-sm hover:bg-slate-50"
                >
                  Clear
                </button>
              </div>
            </div>
          ) : currentUser && isOwnProfile ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
              <p className="text-amber-700 text-sm">You cannot review your own profile</p>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <p className="text-slate-500 text-sm">Please login to leave a review</p>
            </div>
          )}

          <div className="mt-4 space-y-4 max-h-[400px] overflow-y-auto">
            {reviews.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-slate-500">No reviews yet</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="border-b border-slate-100 pb-4 last:border-0">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <User size={14} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-slate-900 text-sm">
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
                            className="w-full border rounded-xl p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                            rows={2}
                            disabled={submitting}
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleEditReview(review.id)}
                              disabled={submitting || !editingReviewText.trim()}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-xs flex items-center gap-1 disabled:opacity-50"
                            >
                              <Check size={12} /> Save
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="border border-slate-300 px-3 py-1 rounded-lg text-xs flex items-center gap-1 hover:bg-slate-50"
                            >
                              <X size={12} /> Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-700 text-sm mt-1 break-words">{review.review}</p>
                      )}
                      
                      {review.rater_id === currentUser?.id && editingReviewId !== review.id && (
                        <div className="flex gap-3 mt-2">
                          <button
                            onClick={() => startEditing(review)}
                            className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                          >
                            <Edit size={12} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="text-red-600 hover:text-red-800 text-xs flex items-center gap-1"
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-8">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">VgraphZ</h3>
              <p className="text-sm text-slate-600">Discover trusted creative professionals across India.</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Explore</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-blue-600">Find Professionals</a></li>
                <li><a href="#" className="hover:text-blue-600">Become a Provider</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-blue-600">About Us</a></li>
                <li><a href="#" className="hover:text-blue-600">Contact</a></li>
                <li><a href="#" className="hover:text-blue-600">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Contact</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2"><Mail size={16} /> support@vgraphz.com</li>
                <li className="flex items-center gap-2"><MapPin size={16} /> India</li>
                <li className="flex items-center gap-2"><Clock size={16} /> Mon – Sat | 9 AM – 7 PM</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
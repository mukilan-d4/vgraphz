"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Upload, X, Move, ZoomIn, ZoomOut } from "lucide-react";

// All Tamil Nadu Districts
const TAMIL_NADU_DISTRICTS = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
  "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kancheepuram",
  "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam",
  "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram",
  "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni",
  "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur",
  "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore",
  "Viluppuram", "Virudhunagar"
];

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("Weak");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [district, setDistrict] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [about, setAbout] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [languages, setLanguages] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Image crop/move state
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [imagePosition, setImagePosition] = useState({ x: 50, y: 50 });
  const [imageScale, setImageScale] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  function checkStrength(value: string) {
    setPassword(value);
    let strength = "Weak";
    if (
      value.length >= 8 &&
      /[A-Z]/.test(value) &&
      /[a-z]/.test(value) &&
      /[0-9]/.test(value) &&
      /[^A-Za-z0-9]/.test(value)
    ) {
      strength = "Strong";
    } else if (value.length >= 6) {
      strength = "Medium";
    }
    setPasswordStrength(strength);
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Check if image is square (1:1 ratio) or at least close
        const ratio = img.width / img.height;
        if (ratio < 0.8 || ratio > 1.2) {
          setError("Please upload a square image (1:1 ratio)");
          return;
        }
        setImageUrl(event.target?.result as string);
        setShowImageEditor(true);
        setImagePosition({ x: 50, y: 50 });
        setImageScale(100);
        setProfileImage(file);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleImageEditorMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleImageEditorMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setImagePosition(prev => ({
      x: Math.max(0, Math.min(100, prev.x + (deltaX / 4))),
      y: Math.max(0, Math.min(100, prev.y + (deltaY / 4)))
    }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleImageEditorMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setImageScale(prev => Math.min(200, prev + 10));
  };

  const handleZoomOut = () => {
    setImageScale(prev => Math.max(50, prev - 10));
  };

  const handleCropConfirm = () => {
    // Create a canvas to crop the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      const size = Math.min(img.width, img.height);
      const x = (img.width - size) * (imagePosition.x / 100);
      const y = (img.height - size) * (imagePosition.y / 100);
      const scaleFactor = imageScale / 100;
      const cropSize = size / scaleFactor;
      const cropX = x + (size - cropSize) / 2;
      const cropY = y + (size - cropSize) / 2;

      canvas.width = 200;
      canvas.height = 200;
      ctx?.drawImage(img, cropX, cropY, cropSize, cropSize, 0, 0, 200, 200);
      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setProfileImagePreview(croppedDataUrl);
      
      // Convert data URL to File
      fetch(croppedDataUrl)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
          setProfileImage(file);
          setShowImageEditor(false);
        });
    };
  };

  async function uploadProfileImage() {
    if (!profileImage) return "";
    
    const fileName = `${Date.now()}-${Math.random()}-${profileImage.name}`;
    const { error } = await supabase.storage
      .from("profile-images")
      .upload(fileName, profileImage);
    
    if (error) {
      console.log("Upload error:", error);
      return "";
    }
    
    const { data } = supabase.storage
      .from("profile-images")
      .getPublicUrl(fileName);
    
    return data.publicUrl;
  }

  async function register(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      setLoading(false);
      return;
    }

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password
    });

    const user = data.user;

    if (signupError) {
      if (signupError.message.toLowerCase().includes("already")) {
        setError("This email is already registered.");
      } else {
        setError(signupError.message);
      }
      setLoading(false);
      return;
    }

    if (!user) {
      setError("User creation failed");
      setLoading(false);
      return;
    }

    // Upload profile image if exists
    let profileImageUrl = "";
    if (profileImage) {
      profileImageUrl = await uploadProfileImage();
    }

    const { error: profileError } = await supabase
      .from("videographers")
      .insert({
        user_id: user.id,
        name,
        email,
        phone,
        category,
        district,
        whatsapp: whatsapp || null,
        about: about || null,
        location: location || null,
        skills: skills || null,
        experience: experience || null,
        languages: languages || null,
        website: website || null,
        instagram: instagram || null,
        youtube: youtube || null,
        portfolio: portfolio || null,
        profile_image: profileImageUrl || null,
        status: "pending",
        approved: false
      });

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    router.push("/login?registered=true");
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">VgraphZ</h1>
          <p className="text-slate-600 mt-1">Create your provider account</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          <form onSubmit={register} className="space-y-4">
            
            {/* Profile Photo Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Profile Photo (Square image recommended)
              </label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-slate-600 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                  >
                    <Upload className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                    <span className="text-sm">Click to upload profile photo</span>
                    <p className="text-xs text-slate-400 mt-1">Max 5MB, square image</p>
                  </button>
                </div>
                {profileImagePreview && (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-slate-200 flex-shrink-0">
                    <img
                      src={profileImagePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Image Editor Modal */}
            {showImageEditor && (
              <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-md w-full p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-900">Edit Photo</h3>
                    <button
                      type="button"
                      onClick={() => setShowImageEditor(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div
                    ref={imageContainerRef}
                    className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-200 cursor-move"
                    onMouseDown={handleImageEditorMouseDown}
                    onMouseMove={handleImageEditorMouseMove}
                    onMouseUp={handleImageEditorMouseUp}
                    onMouseLeave={handleImageEditorMouseUp}
                  >
                    <div
                      className="absolute w-full h-full transition-transform duration-100"
                      style={{
                        transform: `scale(${imageScale / 100}) translate(${(imagePosition.x - 50) * 2}%, ${(imagePosition.y - 50) * 2}%)`,
                        transformOrigin: 'center',
                      }}
                    >
                      <img
                        src={imageUrl}
                        alt="Edit"
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    </div>
                    <div className="absolute inset-0 border-2 border-white rounded-2xl pointer-events-none" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-full h-full border-2 border-white/50 rounded-2xl" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleZoomOut}
                        className="p-2 rounded-xl hover:bg-slate-100 transition"
                      >
                        <ZoomOut size={20} />
                      </button>
                      <span className="text-sm text-slate-600">{Math.round(imageScale)}%</span>
                      <button
                        type="button"
                        onClick={handleZoomIn}
                        className="p-2 rounded-xl hover:bg-slate-100 transition"
                      >
                        <ZoomIn size={20} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Move size={16} />
                      <span>Drag to adjust position</span>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setShowImageEditor(false)}
                      className="flex-1 rounded-xl border border-slate-200 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleCropConfirm}
                      className="flex-1 rounded-xl bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700 transition"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => checkStrength(e.target.value)}
                  placeholder="Create a password"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 pr-12 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-4 z-20 text-slate-400 hover:text-blue-600 transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="mt-2 text-sm">
                Strength : <span className={
                  passwordStrength === "Weak" ? "text-red-600" :
                  passwordStrength === "Medium" ? "text-yellow-600" :
                  "text-green-600"
                }>{passwordStrength}</span>
              </p>
              <p className="mt-1 text-xs text-slate-500">Minimum 8 characters</p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 pr-12 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-4 z-20 text-slate-400 hover:text-blue-600 transition"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {confirmPassword && (
                <p className={`mt-2 text-sm ${password === confirmPassword ? "text-green-600" : "text-red-600"}`}>
                  {password === confirmPassword ? "✓ Passwords Match" : "✗ Passwords Do Not Match"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
                required
              >
                <option value="">Select your category</option>
                <option value="Videographer">Videographer</option>
                <option value="Photographer">Photographer</option>
                <option value="Video Editor">Video Editor</option>
                <option value="Photo Editor">Photo Editor</option>
                <option value="Drone Pilot">Drone Pilot</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                District *
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
                required
              >
                <option value="">Select your district</option>
                {TAMIL_NADU_DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <hr className="border-slate-200" />

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                WhatsApp Number
              </label>
              <input
                type="tel"
                placeholder="Enter WhatsApp number (optional)"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                About
              </label>
              <textarea
                placeholder="Tell people about yourself and your services"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition resize-none"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="Your city/area"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Skills
              </label>
              <input
                type="text"
                placeholder="Wedding, Reels, Product, Editing (comma separated)"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
              />
              <p className="text-xs text-slate-400 mt-1">Separate skills with commas</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Experience (Years)
              </label>
              <input
                type="number"
                placeholder="Years of experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Languages
              </label>
              <input
                type="text"
                placeholder="English, Tamil, Hindi (comma separated)"
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
              />
            </div>

            <hr className="border-slate-200" />

            <h3 className="text-lg font-bold text-slate-900">Online Presence</h3>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Website Link
              </label>
              <input
                type="url"
                placeholder="https://yourwebsite.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Instagram Link
              </label>
              <input
                type="url"
                placeholder="https://instagram.com/yourhandle"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                YouTube Link
              </label>
              <input
                type="url"
                placeholder="https://youtube.com/channel/..."
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Portfolio Link
              </label>
              <input
                type="url"
                placeholder="https://yourportfolio.com"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 px-6 py-3.5 text-white font-semibold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            <p className="text-center text-sm text-slate-600 mt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition">
                Sign In
              </Link>
            </p>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </main>
  );
}
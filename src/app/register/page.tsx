"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">VgraphZ</h1>
          <p className="text-slate-600 mt-1">Create your provider account</p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          <form onSubmit={register} className="space-y-4">
            {/* Full Name */}
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

            {/* Email */}
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

            {/* Password */}
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

            {/* Confirm Password */}
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

            {/* Phone */}
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

            {/* Category */}
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

            {/* District */}
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

            {/* WhatsApp */}
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

            {/* About */}
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

            {/* Location */}
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

            {/* Skills */}
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

            {/* Experience */}
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

            {/* Languages */}
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

            {/* Online Presence */}
            <h3 className="text-lg font-bold text-slate-900">Online Presence</h3>

            {/* Website */}
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

            {/* Instagram */}
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

            {/* YouTube */}
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

            {/* Portfolio */}
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
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SearchProviders() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [district, setDistrict] = useState("");
  const [category, setCategory] = useState("");
  const [showDistricts, setShowDistricts] = useState(false);

  const districtRef = useRef<HTMLDivElement>(null);

  const districts = [
    "Ariyalur",
    "Chengalpattu",
    "Chennai",
    "Coimbatore",
    "Cuddalore",
    "Dharmapuri",
    "Dindigul",
    "Erode",
    "Kallakurichi",
    "Kancheepuram",
    "Karur",
    "Krishnagiri",
    "Madurai",
    "Mayiladuthurai",
    "Nagapattinam",
    "Namakkal",
    "Nilgiris",
    "Perambalur",
    "Pudukkottai",
    "Ramanathapuram",
    "Ranipet",
    "Salem",
    "Sivaganga",
    "Tenkasi",
    "Thanjavur",
    "Theni",
    "Thoothukudi",
    "Tiruchirappalli",
    "Tirunelveli",
    "Tirupathur",
    "Tiruppur",
    "Tiruvallur",
    "Tiruvannamalai",
    "Tiruvarur",
    "Vellore",
    "Viluppuram",
    "Virudhunagar"
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (districtRef.current && !districtRef.current.contains(event.target as Node)) {
        setShowDistricts(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function search() {
    const params = new URLSearchParams();

    if (name) params.set("name", name);
    if (district) params.set("district", district);
    if (category) params.set("category", category);

    router.push(`/providers?${params.toString()}`);
  }

  return (
    <div className="mx-auto mt-10 max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <h3 className="text-2xl font-bold text-slate-900">
        Find Your Perfect Creative Professional
      </h3>

      <p className="mt-2 leading-7 text-slate-600">
        Search by name, district or category.
      </p>

      <div className="mt-6 grid items-end gap-5 md:grid-cols-4">

        <input
          placeholder="Search Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-2xl border border-slate-300 bg-white p-4 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />

        {/* District Custom Dropdown */}
        <div className="relative w-full" ref={districtRef}>
          <button
            type="button"
            onClick={() => setShowDistricts(!showDistricts)}
            className="w-full rounded-2xl border border-slate-300 bg-white p-4 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 flex items-center justify-between"
            style={{ paddingRight: '3rem' }}
          >
            <span>{district || "All Districts"}</span>
            <svg className="h-4 w-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showDistricts && (
            <div className="absolute top-full left-0 z-50 mt-2 w-full max-h-60 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-lg">
              <div
                onClick={() => {
                  setDistrict("");
                  setShowDistricts(false);
                }}
                className="cursor-pointer p-3 hover:bg-slate-100"
              >
                All Districts
              </div>
              {districts.map((item) => (
                <div
                  key={item}
                  onClick={() => {
                    setDistrict(item);
                    setShowDistricts(false);
                  }}
                  className="cursor-pointer p-3 hover:bg-slate-100"
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-2xl border border-slate-300 bg-white p-4 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 appearance-none"
          style={{
            paddingRight: '3rem',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 1rem center',
            backgroundSize: '1.5rem'
          }}
        >
          <option value="">All Categories</option>
          <option>Photographer</option>
          <option>Videographer</option>
          <option>Drone Pilot</option>
          <option>Video Editor</option>
        </select>

        <button
          onClick={search}
          className="w-full rounded-2xl bg-blue-600 py-4 font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Search
        </button>

      </div>

    </div>
  );
}
import Link from "next/link";

export default function ProviderCard({
  provider,
}: {
  provider: any;
}) {
  // Debug log to see if provider is being passed correctly
  console.log("Rendering ProviderCard:", provider.id, provider.name);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">

      {/* Image */}
      <div className="h-56 bg-slate-100 flex-shrink-0 relative">
        {provider.profile_image ? (
          <img
            src={provider.profile_image}
            alt={provider.name}
            className="w-full h-full object-cover transition duration-500 hover:scale-105"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-6xl bg-gradient-to-br from-slate-50 to-slate-200">
            📸
          </div>
        )}
        
        {/* Verified Badge on Image */}
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-md">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Verified
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div>
          {/* Name */}
          <h2 className="text-xl font-bold text-slate-900 line-clamp-1">
            {provider.name}
          </h2>

          {/* Company Name */}
          {provider.company_name && (
            <p className="mt-1 text-slate-600 font-medium line-clamp-1 text-sm">
              {provider.company_name}
            </p>
          )}

          {/* Category Badge */}
          <span className="inline-block mt-3 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">
            {provider.category}
          </span>

          {/* Details */}
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            {provider.district && (
              <p className="flex items-center gap-1.5">
                <span>📍</span>
                <span>{provider.district}</span>
              </p>
            )}

            {provider.experience && (
              <p className="flex items-center gap-1.5">
                <span>⭐</span>
                <span>{provider.experience} Years Experience</span>
              </p>
            )}

            {provider.skills && (
              <p className="line-clamp-2 flex items-start gap-1.5">
                <span>🎬</span>
                <span className="text-slate-500">{provider.skills}</span>
              </p>
            )}
          </div>
        </div>

        {/* Button fixed bottom */}
        <div className="mt-auto pt-6">
          <Link
            href={`/providers/${provider.id}`}
            className="block w-full rounded-2xl bg-blue-600 py-3.5 text-center font-semibold text-white hover:bg-blue-700 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          >
            View Full Profile
          </Link>
        </div>
      </div>

    </div>
  );
}
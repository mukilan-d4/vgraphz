import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function AdminEnquiries() {
  const { data: enquiries } = await supabase
    .from("enquiries")
    .select(`
      *,
      videographers(
        name,
        phone,
        category
      )
    `)
    .order("created_at", { ascending: false });

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; dot: string; label: string }> = {
      new: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", label: "🆕 New" },
      contacted: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500", label: "📞 Contacted" },
      completed: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", label: "✅ Completed" },
    };
    return statusMap[status] || statusMap.new;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      Videographer: "🎥",
      Photographer: "📸",
      "Video Editor": "✂️",
      "Photo Editor": "🖼️",
    };
    return icons[category] || "🎬";
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
                All Enquiries
              </h1>
            </div>
            <p className="text-slate-600 mt-1">
              {enquiries?.length || 0} total enquiries
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="text-sm text-slate-600">
                  {enquiries?.filter(e => e.status === "new" || !e.status).length || 0} New
                </span>
              </span>
              <span className="w-px h-4 bg-slate-200"></span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span className="text-sm text-slate-600">
                  {enquiries?.filter(e => e.status === "contacted").length || 0} Contacted
                </span>
              </span>
              <span className="w-px h-4 bg-slate-200"></span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-sm text-slate-600">
                  {enquiries?.filter(e => e.status === "completed").length || 0} Completed
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Enquiries List */}
        {enquiries && enquiries.length > 0 ? (
          <div className="space-y-4">
            {enquiries.map((item) => {
              const status = getStatusBadge(item.status || "new");
              const categoryIcon = getCategoryIcon(item.videographers?.category);
              
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      {/* Customer & Status */}
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h2 className="text-xl font-bold text-slate-900">
                          {item.customer_name}
                        </h2>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                          {status.label}
                        </span>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <span className="text-slate-400">📞</span>
                          <a
                            href={`tel:${item.customer_phone}`}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {item.customer_phone}
                          </a>
                        </div>
                        
                        {item.event_type && (
                          <div className="flex items-center gap-2 text-slate-600">
                            <span className="text-slate-400">🎬</span>
                            {item.event_type}
                          </div>
                        )}

                        {item.videographers && (
                          <div className="flex items-center gap-2 text-slate-600">
                            <span className="text-slate-400">{categoryIcon}</span>
                            <Link
                              href={`/admin/provider/${item.videographers.id}`}
                              className="hover:text-blue-600 transition-colors font-medium"
                            >
                              {item.videographers.name}
                            </Link>
                          </div>
                        )}
                      </div>

                      {/* Message */}
                      {item.message && (
                        <div className="mt-3 bg-slate-50 rounded-2xl px-4 py-3 border border-slate-200">
                          <p className="text-slate-700 text-sm leading-relaxed">
                            {item.message}
                          </p>
                        </div>
                      )}

                      {/* Date */}
                      {item.created_at && (
                        <p className="mt-3 text-xs text-slate-400 flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(item.created_at).toLocaleDateString()} at{" "}
                          {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-row md:flex-col gap-2 md:min-w-[140px]">
                      <a
                        href={`https://wa.me/${item.customer_phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-white font-semibold text-sm transition-all duration-200 hover:shadow-md"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        WhatsApp
                      </a>
                      <a
                        href={`tel:${item.customer_phone}`}
                        className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-slate-700 font-semibold text-sm transition-all duration-200 hover:shadow-md"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Call
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-12 max-w-md mx-auto">
              <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-slate-700 mb-1">No enquiries yet</h3>
              <p className="text-slate-500">When customers enquire, they'll appear here</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
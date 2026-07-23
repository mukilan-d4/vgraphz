export default function ThanksPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        
        {/* Success Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 text-center">
          
          {/* Success Icon */}
          <div className="mx-auto w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
            <svg 
              className="w-10 h-10 text-emerald-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>

          {/* Content */}
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Enquiry Sent Successfully!
          </h1>
          
          <p className="text-slate-600 leading-relaxed">
            Thank you for reaching out. The provider will contact you soon.
          </p>

          {/* Divider */}
          <div className="my-8 border-t border-slate-200"></div>

          {/* Next Steps */}
          <div className="text-left space-y-3">
            <p className="text-sm font-semibold text-slate-700">What happens next?</p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 font-bold mt-0.5">1.</span>
                <span>Provider will review your enquiry</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 font-bold mt-0.5">2.</span>
                <span>They will contact you via phone or WhatsApp</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-500 font-bold mt-0.5">3.</span>
                <span>Discuss your requirements and finalize</span>
              </li>
            </ul>
          </div>

          {/* Divider */}
          <div className="my-8 border-t border-slate-200"></div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <a
              href="/providers"
              className="block w-full rounded-2xl bg-blue-600 hover:bg-blue-700 px-6 py-3.5 text-white font-semibold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              Find More Professionals
            </a>
            <a
              href="/"
              className="block w-full rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 px-6 py-3.5 text-slate-700 font-semibold transition-all duration-200 hover:shadow-md"
            >
              Back to Home
            </a>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-xs text-slate-500 mt-6">
          You will receive a confirmation email shortly
        </p>
      </div>
    </main>
  );
}
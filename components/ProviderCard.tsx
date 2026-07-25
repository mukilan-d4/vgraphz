import Link from "next/link";

export default function ProviderCard({
  provider,
}: {
  provider: any;
}) {

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

          <div className="h-full flex items-center justify-center text-6xl bg-slate-100">
            📷
          </div>

        )}



        <div className="absolute top-4 right-4">

          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-md">

            ✓ Verified

          </span>

        </div>


      </div>





      {/* Content */}
      <div className="p-6 flex flex-col flex-1">


        <div>


          <h2 className="text-xl font-bold text-slate-900">

            {provider.name}

          </h2>



          {provider.company_name && (

            <p className="mt-1 text-slate-600 font-medium text-sm">

              {provider.company_name}

            </p>

          )}




          {provider.category && (

            <span className="inline-block mt-3 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">

              {provider.category}

            </span>

          )}






          <div className="mt-4 space-y-2 text-sm text-slate-600">


            {provider.district && (

              <p>
                📍 {provider.district}
              </p>

            )}




            {provider.experience && (

              <p>
                ⏳ {provider.experience} Years Experience
              </p>

            )}




            {provider.skills && (

              <p>
                🎬 {provider.skills}
              </p>

            )}


          </div>


        </div>






        {/* Profile Button */}

        <div className="mt-auto pt-6">


          <Link

            href={`/provider/${provider.id}`}

            className="
            block
            w-full
            rounded-2xl
            bg-blue-600
            py-3.5
            text-center
            font-semibold
            text-white
            hover:bg-blue-700
            transition
            "

          >

            View Full Profile

          </Link>


        </div>



      </div>



    </div>
  );
} 
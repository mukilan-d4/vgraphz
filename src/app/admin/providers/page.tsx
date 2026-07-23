import { supabase } from "@/lib/supabase";
import Link from "next/link";
import ProviderCard from "@/components/ProviderCard";


export default async function ProvidersPage({
  searchParams,
}: {
  searchParams: Promise<{
    name?: string;
    district?: string;
    category?: string;
  }>;
}) {


  const params = await searchParams;



  let query = supabase
    .from("videographers")
    .select("*")
    .eq("status", "approved")
    .eq("approved", true);



  if (params.name) {

    query = query.ilike(
      "name",
      `%${params.name}%`
    );

  }



  if (params.district) {

    query = query.ilike(
      "district",
      `%${params.district}%`
    );

  }



  if (params.category) {

    query = query.eq(
      "category",
      params.category
    );

  }



  const { data: providers } = await query.order(
    "created_at",
    {
      ascending:false
    }
  );



  const hasActiveFilters =
    params.name ||
    params.district ||
    params.category;



  return (

    <main className="min-h-screen bg-slate-50 py-24">


      <div className="mx-auto max-w-7xl px-6">


        <h1 className="text-center text-4xl font-bold text-slate-900">
          Find Creative Professionals
        </h1>


        <p className="mt-3 text-center text-slate-600">
          Book trusted photographers and videographers near you
        </p>





        <form
        method="GET"
        className="
        mx-auto
        mt-10
        grid
        max-w-4xl
        gap-4
        rounded-3xl
        bg-white
        p-6
        shadow
        sm:grid-cols-2
        lg:grid-cols-4
        "
        >



          <input
          name="name"
          defaultValue={params.name || ""}
          placeholder="Search by name"
          className="
          rounded-2xl
          border
          px-4
          py-3
          "
          />



          <input
          name="district"
          defaultValue={params.district || ""}
          placeholder="District"
          className="
          rounded-2xl
          border
          px-4
          py-3
          "
          />




          <select
          name="category"
          defaultValue={params.category || ""}
          className="
          rounded-2xl
          border
          px-4
          py-3
          "
          >

            <option value="">
              All Categories
            </option>

            <option>
              Photographer
            </option>

            <option>
              Videographer
            </option>

            <option>
              Drone Pilot
            </option>

            <option>
              Video Editor
            </option>

            <option>
              Photo Editor
            </option>

          </select>





          <button
          className="
          rounded-2xl
          bg-blue-600
          font-semibold
          text-white
          "
          >

            Search

          </button>



        </form>





        {hasActiveFilters && (

          <div className="mt-5 text-center">

            <Link
            href="/providers"
            className="text-blue-600"
            >

              Clear Filters

            </Link>


          </div>

        )}







        <div
        className="
        mt-14
        grid
        gap-8
        sm:grid-cols-2
        lg:grid-cols-3
        "
        >


        {providers?.map((provider)=>(

          <ProviderCard
          key={provider.id}
          provider={provider}
          />

        ))}



        </div>







        {!providers?.length && (

          <div className="
          mt-10
          rounded-3xl
          bg-white
          p-10
          text-center
          shadow
          ">

            <h2 className="text-xl font-bold">
              No professionals found
            </h2>


          </div>

        )}




      </div>


    </main>

  );

}
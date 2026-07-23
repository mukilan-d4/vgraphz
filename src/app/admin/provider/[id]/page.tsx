import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";


export default async function ProviderProfilePage({
  params,
}: {
  params: Promise<{ id:string }>
}) {


  const { id } = await params;


  const { data: provider, error } = await supabase
    .from("videographers")
    .select("*")
    .eq("id", id)
    .eq("approved", true)
    .single();



  if(error || !provider){
    notFound();
  }



  return (

    <main className="min-h-screen bg-slate-50 px-6 py-16">


      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow">


        {provider.profile_image && (

          <img
          src={provider.profile_image}
          alt={provider.name}
          className="
          h-72
          w-full
          rounded-3xl
          object-cover
          "
          />

        )}



        <h1 className="mt-8 text-4xl font-bold">
          {provider.name}
        </h1>


        <p className="mt-2 text-slate-600">
          {provider.category}
        </p>


        <p className="mt-4">
          📍 {provider.district}
        </p>


        <p className="mt-4">
          {provider.about}
        </p>



        <div className="mt-8 flex gap-4">


          <a
          href={`tel:${provider.phone}`}
          className="
          rounded-xl
          bg-blue-600
          px-6
          py-3
          text-white
          "
          >
            Call
          </a>



          <a
          href={`https://wa.me/${provider.whatsapp}`}
          className="
          rounded-xl
          bg-green-600
          px-6
          py-3
          text-white
          "
          >
            WhatsApp
          </a>


        </div>



      </div>


    </main>

  );

}
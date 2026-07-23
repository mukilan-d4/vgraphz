"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ProvidersList() {

  const [providers, setProviders] = useState<any[]>([]);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [district, setDistrict] = useState("All");



  useEffect(() => {

    loadProviders();

  }, []);





  async function loadProviders() {

    const { data, error } = await supabase
      .from("videographers")
      .select("*")
      .eq("status", "approved");

    if (error) {

      console.log(error);

    }

    setProviders(data || []);

  }







  const filteredProviders = providers.filter((provider) => {

    const matchSearch =
      provider.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||

      provider.company_name
        ?.toLowerCase()
        .includes(search.toLowerCase());



    const matchCategory =
      category === "All" ||
      provider.category === category;



    const matchDistrict =
      district === "All" ||
      provider.district === district;



    return (
      matchSearch &&
      matchCategory &&
      matchDistrict
    );

  });








  const districts = [

    ...new Set(

      providers
        .map((provider) => provider.district)
        .filter(Boolean)

    )

  ];








  return (

    <div>



      {/* Filters */}

      <div
        className="
        mx-auto
        mt-8
        grid
        max-w-5xl
        gap-4
        md:grid-cols-3
      "
      >

        <input

          className="
          rounded-lg
          border
          p-3
          "

          placeholder="Search name/company..."

          value={search}

          onChange={(e) =>
            setSearch(e.target.value)
          }

        />





        <select

          className="
          rounded-lg
          border
          p-3
          "

          value={category}

          onChange={(e) =>
            setCategory(e.target.value)
          }

        >

          <option>All</option>

          <option>Videographer</option>

          <option>Photographer</option>

          <option>Video Editor</option>

          <option>Photo Editor</option>

        </select>







        <select

          className="
          rounded-lg
          border
          p-3
          "

          value={district}

          onChange={(e) =>
            setDistrict(e.target.value)
          }

        >

          <option>All</option>

          {districts.map((d: any) => (

            <option key={d}>

              {d}

            </option>

          ))}

        </select>

      </div>







      {/* Provider Cards */}

      <div
        className="
        mx-auto
        mt-10
        grid
        max-w-7xl
        gap-8
        md:grid-cols-2
        lg:grid-cols-3
      "
      >

        {filteredProviders.map((provider) => (

          <div

            key={provider.id}

            className="
            overflow-hidden
            rounded-2xl
            bg-white
            shadow-lg
            transition
            hover:-translate-y-1
            hover:shadow-2xl
          "

          >

            <div className="p-6">

              <Link href={`/providers/${provider.id}`}>

                <div className="flex justify-center">

                  {provider.profile_image ? (

                    <img

                      src={provider.profile_image}

                      alt={provider.name}

                      className="
                      h-36
                      w-36
                      rounded-full
                      border-4
                      border-gray-200
                      object-cover
                    "

                    />

                  ) : (

                    <div

                      className="
                      flex
                      h-36
                      w-36
                      items-center
                      justify-center
                      rounded-full
                      bg-gray-200
                      text-gray-500
                    "

                    >

                      No Photo

                    </div>

                  )}

                </div>
                                <h2
                  className="
                  mt-5
                  text-center
                  text-2xl
                  font-bold
                "
                >
                  {provider.name}
                </h2>

                {provider.company_name && (

                  <p
                    className="
                    mt-1
                    text-center
                    text-gray-600
                  "
                  >
                    🏢 {provider.company_name}
                  </p>

                )}

                <div className="mt-3 flex justify-center">

                  <span
                    className="
                    rounded-full
                    bg-green-100
                    px-3
                    py-1
                    text-sm
                    font-semibold
                    text-green-700
                  "
                  >
                    ✔ Verified Professional
                  </span>

                </div>

                <p
                  className="
                  mt-4
                  text-center
                  font-semibold
                "
                >
                  {provider.category}
                </p>

                <p
                  className="
                  text-center
                  text-gray-500
                "
                >
                  {provider.provider_type}
                </p>

                {provider.experience && (

                  <p
                    className="
                    mt-3
                    text-center
                  "
                  >
                    ⭐ {provider.experience} Years Experience
                  </p>

                )}

                {provider.district && (

                  <p
                    className="
                    mt-2
                    text-center
                  "
                  >
                    📍 {provider.district}
                  </p>

                )}

                {provider.skills && (

                  <div
                    className="
                    mt-4
                    flex
                    flex-wrap
                    justify-center
                    gap-2
                  "
                  >

                    {provider.skills
                      .split(",")
                      .map((skill: string, index: number) => (

                        <span
                          key={index}
                          className="
                          rounded-full
                          bg-gray-100
                          px-3
                          py-1
                          text-sm
                        "
                        >
                          {skill.trim()}
                        </span>

                    ))}

                  </div>

                )}

                <p
                  className="
                  mt-5
                  line-clamp-3
                  text-gray-700
                "
                >
                  {provider.about}
                </p>

              </Link>

              <div
                className="
                mt-8
                flex
                justify-center
                gap-3
              "
              >

                <a
                  href={`tel:${provider.phone}`}
                  className="
                  rounded-lg
                  bg-black
                  px-5
                  py-2
                  text-white
                "
                >
                  📞 Call
                </a>

                <a
                  href={`https://wa.me/${provider.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                  rounded-lg
                  bg-green-600
                  px-5
                  py-2
                  text-white
                "
                >
                  💬 WhatsApp
                </a>

              </div>

              <div
                className="
                mt-4
                flex
                justify-center
                gap-5
              "
              >

                {provider.maps_link && (

                  <a
                    href={provider.maps_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    📍 Maps
                  </a>

                )}

                {provider.website && (

                  <a
                    href={provider.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    🌐 Website
                  </a>

                )}

              </div>

              <Link
                href={`/providers/${provider.id}`}
                className="
                mt-6
                block
                rounded-lg
                bg-blue-600
                py-3
                text-center
                font-semibold
                text-white
              "
              >
                View Full Profile
              </Link>

            </div>

          </div>

        ))}

      </div>

      {filteredProviders.length === 0 && (

        <p
          className="
          mt-10
          text-center
          text-gray-600
        "
        >
          No professionals found
        </p>

      )}

    </div>

  );

}
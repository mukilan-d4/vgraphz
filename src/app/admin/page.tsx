"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);

  const [providers, setProviders] = useState<any[]>([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [categoryFilter, setCategoryFilter] = useState("all");

  const [selectedProvider, setSelectedProvider] =
    useState<any>(null);

  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    checkAdmin();
  }, []);



  async function checkAdmin() {

    const {
      data: { user },
    } = await supabase.auth.getUser();


    if (!user) {
      window.location.href = "/login";
      return;
    }


    const { data: profile } =
      await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();



    if (!profile || profile.role !== "admin") {

      window.location.href =
        "/provider-dashboard";

      return;
    }


    await fetchProviders();

    setLoading(false);

  }




  async function fetchProviders() {

    const {
      data,
      error
    } = await supabase
      .from("videographers")
      .select("*")
      .order(
        "created_at",
        {
          ascending:false
        }
      );



    if(error){

      console.log(error.message);

      return;

    }



    setProviders(data || []);

  }




  async function approveProvider(
    id:number
  ){

    const confirmApprove =
      confirm(
        "Approve this provider?"
      );


    if(!confirmApprove)
      return;



    const {
      error
    } = await supabase
      .from("videographers")
      .update({

        approved:true,

        status:"approved"

      })
      .eq(
        "id",
        id
      );



    if(error){

      alert(error.message);

      return;

    }



    await fetchProviders();

  }





  async function rejectProvider(
    id:number
  ){


    const confirmReject =
      confirm(
        "Reject this provider?"
      );


    if(!confirmReject)
      return;



    const {
      error
    } = await supabase
      .from("videographers")
      .update({

        approved:false,

        status:"rejected"

      })
      .eq(
        "id",
        id
      );



    if(error){

      alert(error.message);

      return;

    }



    await fetchProviders();

  }





  async function deleteProvider(
    id:number
  ){


    const confirmDelete =
      confirm(
        "Delete permanently?"
      );


    if(!confirmDelete)
      return;



    const {
      error
    } = await supabase
      .from("videographers")
      .delete()
      .eq(
        "id",
        id
      );



    if(error){

      alert(error.message);

      return;

    }



    await fetchProviders();

  }





  const totalProviders =
    providers.length;



  const approvedCount =
    providers.filter(
      (p)=>
        p.status==="approved"
    ).length;



  const pendingCount =
    providers.filter(
      (p)=>
        p.status==="pending"
    ).length;



  const rejectedCount =
    providers.filter(
      (p)=>
        p.status==="rejected"
    ).length;



  const categories =
    [
      "all",
      ...Array.from(
        new Set(
          providers.map(
            (p)=>
              p.category
          )
        )
      )
    ];



  const filteredProviders =
    providers.filter(
      (provider)=>{


        const text =
          search.toLowerCase();



        const searchMatch =
          provider.name
            ?.toLowerCase()
            .includes(text)

          ||

          provider.category
            ?.toLowerCase()
            .includes(text)

          ||

          provider.district
            ?.toLowerCase()
            .includes(text);



        const statusMatch =
          statusFilter==="all"
          ||
          provider.status===statusFilter;



        const categoryMatch =
          categoryFilter==="all"
          ||
          provider.category===categoryFilter;



        return (
          searchMatch &&
          statusMatch &&
          categoryMatch
        );

      }
    );




  if(loading){

    return (

      <main className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-slate-50
      ">

        <div className="
        text-center
        ">

          <div className="
          h-12
          w-12
          rounded-full
          border-4
          border-blue-600
          border-t-transparent
          animate-spin
          mx-auto
          "></div>


          <p className="
          mt-4
          text-slate-600
          ">
            Loading Admin Dashboard...
          </p>

        </div>

      </main>

    );

  }
    return (

    <main className="
      min-h-screen
      bg-slate-50
      py-10
    ">

      <div className="
        max-w-7xl
        mx-auto
        px-6
      ">


        {/* Header */}

        <div className="
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-5
        ">


          <div>

            <h1 className="
              text-4xl
              font-bold
              text-slate-900
            ">
              Admin Dashboard
            </h1>


            <p className="
              text-slate-600
              mt-2
            ">
              Manage VgraphZ providers
            </p>


          </div>



          <div className="
            flex
            gap-3
          ">


            <Link

              href="/admin/enquiries"

              className="
                bg-blue-600
                text-white
                px-5
                py-3
                rounded-xl
                font-semibold
              "

            >

              Enquiries

            </Link>




            <button

              onClick={
                async()=>{

                  await supabase.auth.signOut();

                  window.location.href="/login";

                }
              }

              className="
                border
                bg-white
                px-5
                py-3
                rounded-xl
                font-semibold
              "

            >

              Logout

            </button>



          </div>


        </div>





        {/* Statistics */}


        <div className="
          grid
          grid-cols-2
          lg:grid-cols-4
          gap-6
          mt-10
        ">



          <div className="
            bg-white
            rounded-3xl
            border
            shadow-sm
            p-6
          ">

            <p className="
              text-sm
              text-slate-500
            ">
              Total Providers
            </p>


            <h2 className="
              text-3xl
              font-bold
              mt-3
            ">

              {totalProviders}

            </h2>


          </div>





          <div className="
            bg-white
            rounded-3xl
            border
            shadow-sm
            p-6
          ">

            <p className="
              text-sm
              text-slate-500
            ">
              Approved
            </p>


            <h2 className="
              text-3xl
              font-bold
              text-green-600
              mt-3
            ">

              {approvedCount}

            </h2>


          </div>






          <div className="
            bg-white
            rounded-3xl
            border
            shadow-sm
            p-6
          ">

            <p className="
              text-sm
              text-slate-500
            ">
              Pending
            </p>


            <h2 className="
              text-3xl
              font-bold
              text-orange-500
              mt-3
            ">

              {pendingCount}

            </h2>


          </div>






          <div className="
            bg-white
            rounded-3xl
            border
            shadow-sm
            p-6
          ">

            <p className="
              text-sm
              text-slate-500
            ">
              Rejected
            </p>


            <h2 className="
              text-3xl
              font-bold
              text-red-600
              mt-3
            ">

              {rejectedCount}

            </h2>


          </div>



        </div>







        {/* Search and Filters */}



        <div className="
          bg-white
          rounded-3xl
          border
          shadow-sm
          p-6
          mt-10
        ">



          <div className="
            grid
            lg:grid-cols-3
            gap-5
          ">




            <input

              type="text"

              placeholder="Search name, category, district..."

              value={search}

              onChange={
                (e)=>
                  setSearch(e.target.value)
              }

              className="
                border
                rounded-2xl
                px-5
                py-3
                outline-none
              "

            />






            <select

              value={statusFilter}

              onChange={
                (e)=>
                  setStatusFilter(e.target.value)
              }

              className="
                border
                rounded-2xl
                px-5
                py-3
              "

            >

              <option value="all">
                All Status
              </option>


              <option value="pending">
                Pending
              </option>


              <option value="approved">
                Approved
              </option>


              <option value="rejected">
                Rejected
              </option>


            </select>







            <select

              value={categoryFilter}

              onChange={
                (e)=>
                  setCategoryFilter(e.target.value)
              }

              className="
                border
                rounded-2xl
                px-5
                py-3
              "

            >


              {
                categories.map(
                  (cat:string)=>(

                    <option
                      key={cat}
                      value={cat}
                    >

                      {
                        cat==="all"
                        ?
                        "All Categories"
                        :
                        cat
                      }

                    </option>

                  )
                )
              }


            </select>




          </div>



        </div>





        {/* Provider Grid */}


        <div className="
          grid
          md:grid-cols-2
          xl:grid-cols-3
          gap-8
          mt-10
        ">



          {
            filteredProviders.map(
              (provider)=>(


                <div

                  key={provider.id}

                  className="
                    bg-white
                    rounded-3xl
                    border
                    shadow-sm
                    p-6
                    relative
                  "

                >


                  <div className="
                    absolute
                    top-5
                    right-5
                  ">


                    <span

                      className={`
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-semibold

                        ${
                          provider.status==="approved"
                          ?
                          "bg-green-100 text-green-700"

                          :

                          provider.status==="pending"

                          ?

                          "bg-yellow-100 text-yellow-700"

                          :

                          "bg-red-100 text-red-700"

                        }
                      `}

                    >

                      {provider.status}

                    </span>


                  </div>
                                    {/* Profile Image */}

                  <div className="
                    flex
                    justify-center
                    mt-8
                  ">


                    <img

                      src={
                        provider.profile_image ||
                        "/default-profile.png"
                      }

                      alt={provider.name}

                      className="
                        w-28
                        h-28
                        rounded-full
                        object-cover
                        border-4
                        border-white
                        shadow
                      "

                    />


                  </div>





                  {/* Provider Info */}


                  <div className="
                    text-center
                    mt-5
                  ">


                    <h2 className="
                      text-xl
                      font-bold
                      text-slate-900
                    ">

                      {provider.name}

                    </h2>



                    <p className="
                      text-slate-600
                      mt-1
                    ">

                      {provider.category}

                    </p>



                    <p className="
                      text-sm
                      text-slate-500
                      mt-1
                    ">

                      {provider.district || "District not added"}

                    </p>


                  </div>






                  {/* Provider Details */}



                  <div className="
                    mt-6
                    space-y-3
                  ">



                    <div className="
                      flex
                      justify-between
                      text-sm
                    ">

                      <span className="
                        text-slate-500
                      ">
                        Type
                      </span>


                      <span className="
                        font-semibold
                      ">

                        {provider.provider_type || "N/A"}

                      </span>


                    </div>





                    <div className="
                      flex
                      justify-between
                      text-sm
                    ">

                      <span className="
                        text-slate-500
                      ">
                        Experience
                      </span>


                      <span className="
                        font-semibold
                      ">

                        {provider.experience || "N/A"}

                      </span>


                    </div>






                    <div className="
                      flex
                      justify-between
                      text-sm
                    ">

                      <span className="
                        text-slate-500
                      ">
                        Area
                      </span>


                      <span className="
                        font-semibold
                      ">

                        {provider.area || "N/A"}

                      </span>


                    </div>






                    <div className="
                      flex
                      justify-between
                      text-sm
                    ">

                      <span className="
                        text-slate-500
                      ">
                        Phone
                      </span>


                      <span className="
                        font-semibold
                      ">

                        {provider.phone || "N/A"}

                      </span>


                    </div>



                  </div>







                  {/* Skills */}



                  {
                    provider.skills && (

                      <div className="
                        mt-6
                      ">


                        <p className="
                          text-sm
                          text-slate-500
                          mb-3
                        ">

                          Skills

                        </p>



                        <div className="
                          flex
                          flex-wrap
                          gap-2
                        ">


                          {
                            provider.skills
                            .split(",")
                            .map(
                              (
                                skill:string,
                                index:number
                              )=>(


                                <span

                                  key={index}

                                  className="
                                    bg-slate-100
                                    px-3
                                    py-1
                                    rounded-full
                                    text-xs
                                  "

                                >

                                  {skill.trim()}

                                </span>


                              )
                            )
                          }


                        </div>


                      </div>

                    )
                  }








                  {/* Buttons */}



                  <div className="
                    mt-7
                    grid
                    grid-cols-2
                    gap-3
                  ">



                    <Link

                      href={`/provider/${provider.id}`}

                      target="_blank"

                      className="
                        text-center
                        bg-blue-600
                        text-white
                        py-3
                        rounded-xl
                        font-semibold
                        text-sm
                      "

                    >

                      View Profile

                    </Link>





                    <button

                      onClick={()=>{

                        setSelectedProvider(provider);

                        setShowModal(true);

                      }}

                      className="
                        border
                        py-3
                        rounded-xl
                        font-semibold
                        text-sm
                      "

                    >

                      Details

                    </button>



                  </div>







                  {/* Action Buttons */}



                  <div className="
                    mt-4
                    grid
                    grid-cols-3
                    gap-2
                  ">



                    {
                      provider.status !== "approved" && (

                        <button

                          onClick={()=>
                            approveProvider(
                              provider.id
                            )
                          }

                          className="
                            bg-green-600
                            text-white
                            rounded-xl
                            py-2
                            text-xs
                            font-semibold
                          "

                        >

                          Approve

                        </button>

                      )
                    }






                    {
                      provider.status !== "rejected" && (

                        <button

                          onClick={()=>
                            rejectProvider(
                              provider.id
                            )
                          }

                          className="
                            bg-orange-500
                            text-white
                            rounded-xl
                            py-2
                            text-xs
                            font-semibold
                          "

                        >

                          Reject

                        </button>

                      )
                    }






                    <button

                      onClick={()=>
                        deleteProvider(
                          provider.id
                        )
                      }

                      className="
                        bg-red-600
                        text-white
                        rounded-xl
                        py-2
                        text-xs
                        font-semibold
                      "

                    >

                      Delete

                    </button>




                  </div>





                </div>


              )
            )
          }


        </div>
                {
          filteredProviders.length === 0 && (

            <div className="
              mt-10
              bg-white
              rounded-3xl
              border
              p-10
              text-center
            ">


              <h2 className="
                text-xl
                font-bold
              ">

                No providers found

              </h2>



              <p className="
                text-slate-500
                mt-2
              ">

                Try changing search or filters.

              </p>


            </div>

          )
        }







        {/* Provider Details Modal */}



        {
          showModal &&
          selectedProvider && (


            <div className="
              fixed
              inset-0
              bg-black/50
              flex
              items-center
              justify-center
              z-50
              px-5
            ">


              <div className="
                bg-white
                rounded-3xl
                max-w-lg
                w-full
                p-8
                shadow-xl
              ">



                <div className="
                  flex
                  justify-between
                  items-center
                ">


                  <h2 className="
                    text-2xl
                    font-bold
                  ">

                    Provider Details

                  </h2>




                  <button

                    onClick={()=>{

                      setShowModal(false);

                      setSelectedProvider(null);

                    }}

                    className="
                      text-slate-500
                      text-xl
                    "

                  >

                    ✕

                  </button>



                </div>







                <div className="
                  mt-6
                  space-y-4
                ">



                  <div>

                    <p className="
                      text-sm
                      text-slate-500
                    ">

                      Name

                    </p>


                    <p className="
                      font-semibold
                    ">

                      {selectedProvider.name}

                    </p>


                  </div>





                  <div>

                    <p className="
                      text-sm
                      text-slate-500
                    ">

                      Email

                    </p>


                    <p className="
                      font-semibold
                    ">

                      {selectedProvider.email || "N/A"}

                    </p>


                  </div>





                  <div>

                    <p className="
                      text-sm
                      text-slate-500
                    ">

                      WhatsApp

                    </p>


                    <p className="
                      font-semibold
                    ">

                      {selectedProvider.whatsapp || "N/A"}

                    </p>


                  </div>





                  <div>

                    <p className="
                      text-sm
                      text-slate-500
                    ">

                      Address

                    </p>


                    <p className="
                      font-semibold
                    ">

                      {selectedProvider.address || "N/A"}

                    </p>


                  </div>






                  <div>

                    <p className="
                      text-sm
                      text-slate-500
                    ">

                      About

                    </p>


                    <p className="
                      font-semibold
                      text-sm
                    ">

                      {selectedProvider.about || "N/A"}

                    </p>


                  </div>





                  {
                    selectedProvider.youtube_link && (

                      <a

                        href={
                          selectedProvider.youtube_link
                        }

                        target="_blank"

                        className="
                          block
                          bg-red-600
                          text-white
                          text-center
                          py-3
                          rounded-xl
                          font-semibold
                        "

                      >

                        Watch YouTube Video

                      </a>

                    )
                  }




                </div>






                <button

                  onClick={()=>{

                    setShowModal(false);

                    setSelectedProvider(null);

                  }}

                  className="
                    mt-7
                    w-full
                    bg-slate-900
                    text-white
                    py-3
                    rounded-xl
                    font-semibold
                  "

                >

                  Close

                </button>




              </div>



            </div>


          )
        }




      </div>


    </main>


  );

}
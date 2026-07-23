"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

import {
  MapPin,
  Phone,
  MessageCircle,
  Globe,
  FolderOpen,
  Award,
  Languages,
  Truck,
} from "lucide-react";


export default function ProviderDetailPage() {

  const params = useParams();

  const id = params.id as string;


  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {

    if(id){
      loadProvider();
    }

  }, [id]);




  async function loadProvider(){


    const { data, error } = await supabase
      .from("videographers")
      .select("*")
      .eq("id", id)
      .single();



    console.log("VIEW PROFILE DATA:", data);



    if(error){

      console.log(error);

      setLoading(false);

      return;

    }


    setProvider(data);

    setLoading(false);


  }





  function convertArray(value:any){

    if(!value) return [];


    if(Array.isArray(value)){

      return value;

    }


    try{

      return JSON.parse(value);

    }

    catch{

      return value
      .replace("[","")
      .replace("]","")
      .split(",")
      .map((x:string)=>x.replace(/"/g,"").trim())
      .filter(Boolean);

    }

  }





  if(loading){

    return(

      <div className="min-h-screen flex items-center justify-center">

        Loading...

      </div>

    )

  }





  if(!provider){

    return(

      <div className="min-h-screen flex items-center justify-center">

        Provider not found

      </div>

    )

  }




  const skills = convertArray(provider.skills);

  const languages = convertArray(provider.languages);



  return (

    <div className="min-h-screen bg-slate-50">


      <div className="max-w-4xl mx-auto px-4 py-10">


        <div className="bg-white rounded-3xl shadow p-8">



          {
            provider.profile_image &&

            <img

              src={provider.profile_image}

              alt={provider.name}

              className="
              w-full
              h-72
              object-cover
              rounded-3xl
              "

            />

          }





          <h1 className="text-4xl font-bold mt-8">

            {provider.name}

          </h1>




          <p className="text-blue-600 font-semibold mt-2">

            {provider.category}

          </p>




          <div className="mt-5 space-y-3 text-slate-600">


            {
              provider.district &&

              <p className="flex gap-2">

                <MapPin size={18}/>

                {provider.district}

              </p>

            }



            {
              provider.state &&

              <p>

                State: {provider.state}

              </p>

            }





            {
              provider.experience &&

              <p className="flex gap-2">

                <Award size={18}/>

                {provider.experience} Years Experience

              </p>

            }



          </div>
                    {/* ABOUT */}

          <div className="mt-8">

            <h2 className="text-xl font-bold">
              About
            </h2>


            <p className="mt-3 text-slate-600">

              {provider.about || "No description"}

            </p>

          </div>





          {/* SKILLS */}

          <div className="mt-8">


            <h2 className="text-xl font-bold">

              Skills

            </h2>



            <div className="flex flex-wrap gap-2 mt-3">


              {

                skills.length > 0 ?


                skills.map((skill:string,index:number)=>(

                  <span

                    key={index}

                    className="
                    bg-blue-50
                    text-blue-700
                    px-3
                    py-1
                    rounded-full
                    "

                  >

                    {skill}

                  </span>


                ))


                :

                <p className="text-slate-500">
                  No skills added
                </p>


              }


            </div>


          </div>







          {/* LANGUAGES */}


          <div className="mt-8">


            <h2 className="text-xl font-bold flex gap-2">

              <Languages size={22}/>

              Languages

            </h2>



            <div className="flex flex-wrap gap-2 mt-3">


              {


              languages.length > 0 ?


              languages.map((lang:string,index:number)=>(


                <span

                  key={index}

                  className="
                  bg-green-50
                  text-green-700
                  px-3
                  py-1
                  rounded-full
                  "

                >

                  {lang}

                </span>


              ))


              :

              <p className="text-slate-500">
                No languages added
              </p>


              }


            </div>


          </div>







          {/* ONLINE PRESENCE */}



          <div className="mt-8">


            <h2 className="text-xl font-bold flex gap-2">


              <Globe size={22}/>

              Online Presence


            </h2>




            <div className="flex flex-wrap gap-3 mt-4">





              {
                provider.website &&

                <a

                  href={provider.website}

                  target="_blank"

                  className="
                  bg-slate-100
                  px-4
                  py-2
                  rounded-xl
                  "

                >

                  Website

                </a>

              }







              {
                provider.youtube &&

                <a

                  href={provider.youtube}

                  target="_blank"

                  className="
                  bg-red-100
                  px-4
                  py-2
                  rounded-xl
                  "

                >

                  YouTube

                </a>

              }







              {
                provider.instagram &&

                <a

                  href={provider.instagram}

                  target="_blank"

                  className="
                  bg-pink-100
                  px-4
                  py-2
                  rounded-xl
                  "

                >

                  Instagram

                </a>

              }








              {
                provider.portfolio &&

                <a

                  href={provider.portfolio}

                  target="_blank"

                  className="
                  bg-purple-100
                  px-4
                  py-2
                  rounded-xl
                  "

                >

                  Portfolio

                </a>

              }



            </div>


          </div>







          {/* DELIVERY */}



          {

          (provider.delivery || provider.delivery_time) &&


          <div className="mt-8">


            <h2 className="text-xl font-bold flex gap-2">


              <Truck size={22}/>

              Delivery


            </h2>




            <p className="mt-3 text-slate-600">


              {provider.delivery || provider.delivery_time}


            </p>


          </div>


          }







          {/* CONTACT */}

          <div className="mt-10 flex gap-4">



            <a

              href={`tel:${provider.phone}`}

              className="
              bg-blue-600
              text-white
              px-6
              py-3
              rounded-xl
              flex
              gap-2
              items-center
              "

            >

              <Phone size={20}/>

              Call

            </a>





            <a

              href={`https://wa.me/${provider.phone}`}

              target="_blank"

              className="
              bg-green-600
              text-white
              px-6
              py-3
              rounded-xl
              flex
              gap-2
              items-center
              "

            >

              <MessageCircle size={20}/>

              WhatsApp

            </a>



          </div>



        </div>


      </div>


    </div>


  );


}
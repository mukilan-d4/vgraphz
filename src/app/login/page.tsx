"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";


export default function LoginPage() {


  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const [showPassword,setShowPassword] = useState(false);

  const [error,setError] = useState("");

  const [loading,setLoading] = useState(false);



  async function handleLogin(e:React.FormEvent){

    e.preventDefault();


    if(loading) return;


    setLoading(true);
    setError("");



    try{


      console.log(
        "LOGIN START:",
        email
      );



      const {
        data,
        error:loginError

      } = await supabase.auth.signInWithPassword({

        email:email.trim().toLowerCase(),

        password

      });



      if(loginError){

        console.log(loginError);

        setError(
          loginError.message
        );

        return;

      }




      if(!data.user){

        setError(
          "User not found"
        );

        return;

      }




      console.log(
        "LOGIN SUCCESS:",
        data.user.id
      );





      /*
        1. CHECK ADMIN FIRST
      */


      const {

        data:profile,
        error:profileError

      } = await supabase

      .from("profiles")

      .select("role")

      .eq(
        "id",
        data.user.id
      )

      .maybeSingle();





      console.log(
        "PROFILE:",
        profile
      );


      console.log(
        "PROFILE ERROR:",
        profileError
      );





      if(profile?.role === "admin"){


        console.log(
          "REDIRECT ADMIN"
        );


        window.location.href =
          "/admin";


        return;


      }





      /*
        2. CHECK PROVIDER
      */



      const {

        data:provider,
        error:providerError

      } = await supabase

      .from("videographers")

      .select("id")

      .eq(
        "user_id",
        data.user.id
      )

      .maybeSingle();





      console.log(
        "PROVIDER:",
        provider
      );


      console.log(
        "PROVIDER ERROR:",
        providerError
      );





      if(provider){


        console.log(
          "REDIRECT PROVIDER"
        );


        window.location.href =
          "/provider-dashboard";


        return;


      }





      /*
        3. NEW USER
      */



      console.log(
        "REDIRECT JOIN PROVIDER"
      );



      window.location.href =
        "/join-provider";



    }


    catch(err:any){


      console.log(
        "LOGIN ERROR:",
        err
      );


      setError(
        err.message ||
        "Something went wrong"
      );


    }


    finally{


      setLoading(false);


    }


  }





  return (

    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">


      <div className="w-full max-w-md">


        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-slate-900">
            VgraphZ
          </h1>


          <p className="text-slate-600 mt-1">
            Sign in to your account
          </p>


        </div>





        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">



          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >




            <div>


              <label className="block text-sm font-semibold text-slate-700 mb-2">

                Email Address

              </label>



              <input

                type="email"

                value={email}

                onChange={
                  e=>setEmail(e.target.value)
                }

                className="w-full rounded-2xl border border-slate-200 px-4 py-3"

                required

              />


            </div>







            <div>


              <div className="flex justify-between mb-2">


                <label className="text-sm font-semibold text-slate-700">

                  Password

                </label>



                <Link

                  href="/forgot-password"

                  className="text-sm text-blue-600"

                >

                  Forgot password?

                </Link>


              </div>





              <div className="relative">


                <input


                  type={
                    showPassword
                    ?
                    "text"
                    :
                    "password"
                  }



                  value={password}


                  onChange={
                    e=>setPassword(e.target.value)
                  }



                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 pr-12"



                  required



                />





                <button


                  type="button"


                  onClick={
                    ()=>setShowPassword(!showPassword)
                  }



                  className="absolute right-4 top-3 text-slate-500"


                >

                  {
                    showPassword
                    ?
                    <EyeOff size={20}/>
                    :
                    <Eye size={20}/>
                  }


                </button>



              </div>


            </div>







            {
              error &&

              <div className="bg-red-50 border border-red-200 rounded-xl p-3">

                <p className="text-red-600 text-sm">

                  {error}

                </p>


              </div>

            }







            <button


              type="submit"


              disabled={loading}


              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-3 font-semibold disabled:opacity-50"


            >


              {
                loading
                ?
                "Signing in..."
                :
                "Sign In"
              }



            </button>






            <p className="text-center text-sm text-slate-600">


              Don't have an account?


              <Link

                href="/register"

                className="text-blue-600 font-semibold ml-1"

              >

                Create Account

              </Link>


            </p>





          </form>



        </div>




      </div>


    </main>


  );

}
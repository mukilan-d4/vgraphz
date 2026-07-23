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


      const {
        data,
        error:loginError

      } = await supabase.auth.signInWithPassword({

        email:email.trim().toLowerCase(),

        password

      });



      if(loginError){

        setError(
          loginError.message
        );

        setLoading(false);

        return;

      }




      if(!data.user){

        setError(
          "Login failed"
        );

        setLoading(false);

        return;

      }



      console.log(
        "LOGIN SUCCESS",
        data.user.id
      );





      // CHECK ADMIN


      const {

        data:profile

      } = await supabase

      .from("profiles")

      .select("role")

      .eq(
        "id",
        data.user.id
      )

      .maybeSingle();




      console.log(
        "PROFILE",
        profile
      );




      if(profile?.role === "admin"){


        window.location.replace(
          "/admin"
        );


        return;

      }







      // CHECK PROVIDER


      const {

        data:provider

      } = await supabase

      .from("videographers")

      .select("id")

      .eq(
        "user_id",
        data.user.id
      )

      .maybeSingle();





      console.log(
        "PROVIDER",
        provider
      );





      if(provider){


        window.location.replace(
          "/provider-dashboard"
        );


        return;


      }






      // NEW USER


      window.location.replace(
        "/join-provider"
      );



    }


    catch(err:any){


      console.log(
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

    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">


      <div className="w-full max-w-md">



        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-slate-900">
            VgraphZ
          </h1>


          <p className="text-slate-600">
            Sign in to your account
          </p>


        </div>






        <div className="bg-white rounded-3xl shadow p-8 border">


          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >



            <div>

              <label className="block mb-2 font-semibold">

                Email Address

              </label>


              <input

                type="email"

                value={email}

                onChange={
                  e=>setEmail(e.target.value)
                }

                className="w-full border rounded-xl px-4 py-3"

                required

              />

            </div>






            <div>


              <div className="flex justify-between mb-2">

                <label className="font-semibold">

                  Password

                </label>


                <Link
                  href="/forgot-password"
                  className="text-blue-600 text-sm"
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


                  className="w-full border rounded-xl px-4 py-3 pr-12"


                  required


                />



                <button

                  type="button"

                  onClick={
                    ()=>setShowPassword(!showPassword)
                  }

                  className="absolute right-4 top-3 text-gray-500"

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

              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm">

                {error}

              </div>

            }







            <button

              disabled={loading}

              className="w-full bg-blue-600 text-white rounded-xl py-3 font-semibold disabled:opacity-50"

            >

              {
                loading
                ?
                "Signing in..."
                :
                "Sign In"
              }


            </button>








            <p className="text-center text-sm">


              Don't have an account?


              <Link

                href="/register"

                className="text-blue-600 ml-1 font-semibold"

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
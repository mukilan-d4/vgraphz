"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ForgotPasswordPage() {

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  async function sendReset(e: React.FormEvent) {

    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");


    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo:
          `${window.location.origin}/reset-password`
      }
    );


    if (error) {

      setError(error.message);

    } else {

      setMessage(
        "Reset password link sent. Check your email."
      );

    }


    setLoading(false);

  }



  return (

    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">


      <div className="bg-white rounded-3xl shadow p-8 w-full max-w-md">


        <h1 className="text-3xl font-bold text-slate-900">
          Forgot Password
        </h1>


        <p className="text-slate-600 mt-2">
          Enter your email to receive reset link.
        </p>



        <form
          onSubmit={sendReset}
          className="mt-6 space-y-4"
        >


          <input

            type="email"

            required

            placeholder="Enter your email"

            value={email}

            onChange={(e)=>setEmail(e.target.value)}

            className="
            w-full border rounded-xl px-4 py-3
            "

          />



          <button

            disabled={loading}

            className="
            w-full bg-blue-600 text-white
            rounded-xl py-3 font-semibold
            "

          >

            {
              loading
              ?
              "Sending..."
              :
              "Send Reset Link"
            }

          </button>


        </form>



        {
          message &&
          <p className="text-green-600 mt-4">
            {message}
          </p>
        }



        {
          error &&
          <p className="text-red-600 mt-4">
            {error}
          </p>
        }



        <Link
          href="/login"
          className="block mt-6 text-blue-600 text-center"
        >
          ← Back to Login
        </Link>


      </div>


    </main>

  );

}
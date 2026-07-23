"use client";

import { useEffect, useState } from "react";

export default function EnvTestPage() {
  const [envVars, setEnvVars] = useState<{url: string, key: string}>({url: "", key: ""});

  useEffect(() => {
    setEnvVars({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || "NOT SET",
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "SET (length: " + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length + ")" : "NOT SET"
    });
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Environment Variables Test</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-2xl">
            <p className="font-semibold">NEXT_PUBLIC_SUPABASE_URL:</p>
            <p className="text-sm text-slate-600 break-all">{envVars.url}</p>
          </div>
          
          <div className="p-4 bg-slate-50 rounded-2xl">
            <p className="font-semibold">NEXT_PUBLIC_SUPABASE_ANON_KEY:</p>
            <p className="text-sm text-slate-600">{envVars.key}</p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-2xl">
            <p className="text-sm text-blue-700">
              {envVars.url !== "NOT SET" && envVars.key !== "NOT SET" 
                ? "✅ Environment variables are loaded correctly!" 
                : "❌ Environment variables are NOT loaded correctly!"}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
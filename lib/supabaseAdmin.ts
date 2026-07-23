import { createClient } from "@supabase/supabase-js";


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;



if(!supabaseUrl){

  throw new Error("Missing SUPABASE URL");

}


if(!serviceKey){

  throw new Error("Missing SUPABASE SERVICE ROLE KEY");

}



export const supabaseAdmin = createClient(
  supabaseUrl,
  serviceKey
);
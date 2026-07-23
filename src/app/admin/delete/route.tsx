import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";


export async function POST(req:Request){

const formData = await req.formData();

const id=formData.get("id");



await supabase

.from("videographers")

.delete()

.eq(
"id",
id
);



return NextResponse.redirect(
new URL("/admin",req.url)
);


}
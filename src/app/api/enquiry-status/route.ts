import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";


export async function POST(req:Request){


const formData = await req.formData();


const id = formData.get("id");

const status = formData.get("status");



if(!id || !status){

return NextResponse.json(
{
error:"Missing data"
},
{
status:400
}
);

}



const {error}=await supabase

.from("enquiries")

.update({

status

})

.eq(
"id",
id
);



if(error){

return NextResponse.json(
{
error:error.message
},
{
status:500
}
);

}



return NextResponse.redirect(
new URL(
"/provider-dashboard",
req.url
)
);


}
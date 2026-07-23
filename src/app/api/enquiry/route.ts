import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";


export async function POST(req:Request){


const formData = await req.formData();


const provider_id = formData.get("provider_id");

const customer_name = formData.get("customer_name");

const customer_phone = formData.get("customer_phone");

const event_type = formData.get("event_type");

const message = formData.get("message");


if(!customer_phone){

return NextResponse.json(
{
error:"Phone required"
},
{
status:400
}
);

}



const {error}=await supabase

.from("enquiries")

.insert({

provider_id,

customer_name,

customer_phone,

event_type,

message,

status:"new"

});



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
"/thanks",
req.url
)

);


}
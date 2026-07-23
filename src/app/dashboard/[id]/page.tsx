import { supabase } from "@/lib/supabase";


export default async function ProviderDashboard({

params

}:{

params:Promise<{id:string}>

}) {


const {id}=await params;



const {data:enquiries,error}=

await supabase

.from("enquiries")

.select("*")

.eq("provider_id",id)

.order("created_at",{ascending:false});



return (

<main className="
min-h-screen
bg-gray-100
py-10
">


<div className="
mx-auto
max-w-5xl
px-5
">


<h1 className="
text-3xl
font-bold
">

Provider Dashboard

</h1>


<p className="
mt-2
text-gray-600
">

Your Customer Enquiries

</p>



<div className="
mt-8
space-y-5
">


{
enquiries?.map((item)=>(


<div

key={item.id}

className="
rounded-xl
bg-white
p-6
shadow
"

>


<h2 className="
text-xl
font-bold
">

{item.customer_name}

</h2>


<p className="mt-2">

📞 {item.customer_phone}

</p>


<p>

🎬 {item.event_type}

</p>


<p className="
mt-3
text-gray-700
">

{item.message}

</p>



<a

href={`https://wa.me/${item.customer_phone}`}

target="_blank"

className="
mt-4
inline-block
rounded-lg
bg-green-600
px-5
py-2
text-white
"

>

WhatsApp Customer

</a>


</div>


))

}



{
(!enquiries || enquiries.length===0) && (

<p className="
mt-5
text-gray-600
">

No enquiries yet

</p>

)

}


</div>


</div>


</main>

);


}
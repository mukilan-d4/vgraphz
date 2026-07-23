import { supabase } from "@/lib/supabase";
import Link from "next/link";


export default async function Dashboard(){


const {
  data:{
    user
  }
}=await supabase.auth.getUser();


if(!user){

return (

<main className="
min-h-screen
flex
items-center
justify-center
">

<h1 className="text-2xl font-bold">
Please Login
</h1>

</main>

)

}


const {data:provider}=

await supabase

.from("videographers")

.select("*")

.eq(
"email",
user.email
)

.single();



if(!provider){

return (

<main className="
min-h-screen
flex
items-center
justify-center
">

<h1 className="text-2xl font-bold">
Provider profile not found
</h1>

</main>

)

}



const {data:enquiries}=

await supabase

.from("enquiries")

.select("*")

.eq(
"provider_id",
provider.id
)

.order(
"created_at",
{
ascending:false
}
);



const portfolioCount = [

provider?.portfolio_image1,

provider?.portfolio_image2,

provider?.portfolio_image3,

provider?.portfolio_image4,

provider?.portfolio_image5

].filter(Boolean).length;



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

Welcome {provider?.name}

</p>




<div className="
mt-8
grid
gap-5
md:grid-cols-3
">


<div className="
rounded-xl
bg-white
p-5
shadow
">

<h2 className="font-bold">

📩 Total Leads

</h2>


<p className="
mt-2
text-3xl
">

{
enquiries?.length || 0
}

</p>

</div>




<div className="
rounded-xl
bg-white
p-5
shadow
">

<h2 className="font-bold">

⭐ Status

</h2>


<p className="mt-2">

{provider?.status}

</p>


</div>




<div className="
rounded-xl
bg-white
p-5
shadow
">

<h2 className="font-bold">

📸 Portfolio

</h2>


<p className="mt-2">

{portfolioCount} Photos

</p>


</div>


</div>




<Link

href={`/providers/${provider.id}`}

className="
mt-8
block
rounded-lg
bg-blue-600
py-3
text-center
text-white
"

>

View Public Profile

</Link>






<h2 className="
mt-10
text-2xl
font-bold
">

Customer Enquiries

</h2>




<div className="
mt-5
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


<h3 className="font-bold text-xl">

{item.customer_name}

</h3>



<p>
📞 {item.customer_phone}
</p>



<p>
🎬 {item.event_type}
</p>



<p className="mt-3">

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

💬 WhatsApp Customer

</a>



</div>


))

}



</div>



</div>


</main>

);


}
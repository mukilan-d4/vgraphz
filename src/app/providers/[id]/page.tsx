"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  MapPin,
  Phone,
  MessageCircle,
  Send,
  User,
  CheckCircle,
  Mail,
  Trash2,
  Edit,
  Check,
  X,
  Globe,
  Award,
  Languages,
  Truck
} from "lucide-react";


interface Review {
  id:string;
  provider_id:number;
  rater_id:string;
  review:string;
  created_at:string;
}



interface Provider {

id:number;

name:string;

email:string;

category:string;

district:string;

about:string;

profile_image:string;

user_id:string;

phone?:string;

verified?:boolean;

skills:any;

languages:any;

website?:string;

youtube?:string;

portfolio?:string;

instagram?:string;

experience?:string;

location?:string;

delivery?:string;

}




export default function ProviderDetailPage(){


const params = useParams();

const providerId = params.id as string;



const [provider,setProvider] = useState<Provider|null>(null);

const [reviews,setReviews] = useState<Review[]>([]);

const [reviewCount,setReviewCount] = useState(0);

const [loading,setLoading] = useState(true);

const [currentUser,setCurrentUser] = useState<any>(null);

const [error,setError] = useState("");

const [reviewText,setReviewText] = useState("");

const [submitting,setSubmitting] = useState(false);



useEffect(()=>{

fetchData();

},[providerId]);





async function fetchData(){


try{


setLoading(true);



const {
data:{user}
}=await supabase.auth.getUser();


setCurrentUser(user);



const {
data:providerData,
error:providerError

}=await supabase

.from("videographers")

.select("*")

.eq(
"id",
Number(providerId)
)

.maybeSingle();





if(providerError){

console.log(providerError);

setError(providerError.message);

return;

}




if(!providerData){

setError("Provider not found");

return;

}



console.log(
"PROVIDER DATA:",
providerData
);



setProvider(providerData);





const {
data:reviewsData

}=await supabase

.from("reviews")

.select("*")

.eq(
"provider_id",
Number(providerId)
)

.order(
"created_at",
{
ascending:false
}
);





setReviews(
reviewsData || []
);


setReviewCount(
reviewsData?.length || 0
);



}

catch(err:any){

console.log(err);

setError(
err.message
);

}

finally{

setLoading(false);

}


}
const getSkills = () => {

  if (!provider?.skills) return [];

  if (Array.isArray(provider.skills)) {
    return provider.skills;
  }

  if (typeof provider.skills === "string") {

    return provider.skills
      .split(",")
      .map((x:string)=>x.trim())
      .filter(Boolean);

  }

  return [];

};



const getLanguages = () => {

  if (!provider?.languages) return [];

  if (Array.isArray(provider.languages)) {
    return provider.languages;
  }


  if (typeof provider.languages === "string") {

    return provider.languages
      .split(",")
      .map((x:string)=>x.trim())
      .filter(Boolean);

  }


  return [];

};






async function handleSubmitReview(){


if(!currentUser){

setError(
"Please login to leave a review"
);

return;

}



if(!reviewText.trim()){

setError(
"Write a review"
);

return;

}



try{


setSubmitting(true);


const {
data,
error

}=await supabase

.from("reviews")

.insert({

provider_id:Number(providerId),

rater_id:currentUser.id,

review:reviewText.trim()

})

.select()

.single();





if(error)
throw error;



setReviews(
[
data,
...reviews
]
);



setReviewCount(
reviewCount+1
);



setReviewText("");



}

catch(err:any){

setError(
err.message
);

}

finally{

setSubmitting(false);

}



}






function handleCallNow(){

if(provider?.phone){

window.location.href =
`tel:${provider.phone}`;

}

}





function handleWhatsApp(){


if(provider?.phone){


window.open(

`https://wa.me/${provider.phone}`,

"_blank"

);


}

}
if(loading){

return (

<div className="min-h-screen flex items-center justify-center bg-slate-50">

<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>

</div>

);

}





if(!provider){

return (

<div className="min-h-screen flex items-center justify-center bg-slate-50">

<div className="text-center">

<h2 className="text-xl font-bold text-red-600">
{error || "Provider not found"}
</h2>

<a
href="/providers"
className="text-blue-600 mt-4 inline-block"
>
Back to Providers
</a>

</div>

</div>

);

}



return (

<main className="min-h-screen bg-slate-50 py-10 px-5">


<div className="max-w-5xl mx-auto bg-white rounded-3xl shadow p-8">


{/* Profile Image */}

{
provider.profile_image &&

<img

src={provider.profile_image}

alt={provider.name}

className="
w-full
h-80
object-cover
rounded-3xl
"

/>

}



<h1 className="text-4xl font-bold mt-8 text-slate-900">

{provider.name}

</h1>



<p className="text-blue-600 font-semibold mt-2">

{provider.category}

</p>



<div className="mt-4 flex items-center gap-2 text-slate-600">

<MapPin size={18}/>

{provider.district || "Location not added"}

</div>





<p className="mt-6 text-slate-700">

{provider.about || "No description added"}

</p>





{/* Contact Buttons */}

<div className="flex gap-4 mt-8">


<button

onClick={handleCallNow}

className="
bg-blue-600
text-white
px-6
py-3
rounded-xl
flex
gap-2
items-center
"

>

<Phone size={18}/>

Call

</button>





<button

onClick={handleWhatsApp}

className="
bg-green-600
text-white
px-6
py-3
rounded-xl
flex
gap-2
items-center
"

>

<MessageCircle size={18}/>

WhatsApp

</button>


</div>







{/* Skills */}

<div className="mt-10">


<h2 className="text-xl font-bold mb-4">

Skills

</h2>



<div className="flex flex-wrap gap-2">


{

getSkills().length > 0

?

getSkills().map((skill:string,index:number)=>(


<span

key={index}

className="
bg-blue-50
text-blue-700
px-4
py-2
rounded-full
"

>

{skill}

</span>


))


:

<p className="text-slate-500">

No skills added

</p>


}



</div>


</div>









{/* Languages */}

<div className="mt-8">


<h2 className="text-xl font-bold mb-4 flex gap-2 items-center">

<Languages size={20}/>

Languages

</h2>



<div className="flex flex-wrap gap-2">


{

getLanguages().length > 0

?

getLanguages().map((lang:string,index:number)=>(


<span

key={index}

className="
bg-green-50
text-green-700
px-4
py-2
rounded-full
"

>

{lang}

</span>


))


:

<p className="text-slate-500">

No languages added

</p>


}


</div>


</div>









{/* Experience */}

{

provider.experience &&

<div className="mt-8">


<h2 className="text-xl font-bold flex gap-2 items-center">

<Award size={20}/>

Experience

</h2>



<p className="mt-2 text-slate-600">

{provider.experience} Years

</p>


</div>


}









{/* Reviews */}

<div className="mt-10">


<h2 className="text-2xl font-bold">

Reviews ({reviewCount})

</h2>





<textarea

value={reviewText}

onChange={
e=>setReviewText(e.target.value)
}

placeholder="Write your review"

className="
w-full
border
rounded-xl
p-4
mt-4
"

rows={4}

/>



<button

onClick={handleSubmitReview}

disabled={submitting}

className="
mt-3
bg-blue-600
text-white
px-6
py-3
rounded-xl
"

>

{
submitting
?
"Submitting..."
:
"Submit Review"
}

</button>







<div className="mt-6 space-y-4">


{

reviews.map((review)=>(


<div

key={review.id}

className="
border-b
pb-4
"


>


<p className="text-slate-700">

{review.review}

</p>


<p className="text-xs text-slate-400">

{new Date(review.created_at).toLocaleDateString()}

</p>


</div>


))


}


</div>


</div>



</div>


</main>

);

}
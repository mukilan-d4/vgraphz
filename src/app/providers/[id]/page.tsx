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
  Mail,
  Clock,
  CheckCircle,
  Edit,
  Trash2,
  X,
  Check,
  Globe,
  FolderOpen,
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

  whatsapp?:string;

  verified?:boolean;

  skills?:string[];

  website?:string;

  youtube?:string;

  portfolio?:string;

  instagram?:string;

  experience?:string;

  location?:string;

  languages?:string[];

  delivery?:string;

}



export default function ProviderDetailPage(){


const params = useParams();


const providerId = params.id as string;



const [provider,setProvider] =
useState<Provider|null>(null);



const [reviews,setReviews] =
useState<Review[]>([]);



const [reviewCount,setReviewCount] =
useState(0);



const [loading,setLoading] =
useState(true);



const [currentUser,setCurrentUser] =
useState<any>(null);



const [error,setError] =
useState("");



const [success,setSuccess] =
useState("");



const [reviewText,setReviewText] =
useState("");



const [submitting,setSubmitting] =
useState(false);



const [editingReviewId,setEditingReviewId] =
useState<string|null>(null);



const [editingReviewText,setEditingReviewText] =
useState("");



const [showEnquiryForm,setShowEnquiryForm] =
useState(false);



const [enquiryName,setEnquiryName] =
useState("");



const [enquiryPhone,setEnquiryPhone] =
useState("");



const [enquiryEvent,setEnquiryEvent] =
useState("");



const [enquiryRequirements,setEnquiryRequirements] =
useState("");



const [enquirySubmitting,setEnquirySubmitting] =
useState(false);



const [enquirySuccess,setEnquirySuccess] =
useState("");



const [enquiryError,setEnquiryError] =
useState("");



const [isOwnProfile,setIsOwnProfile] =
useState(false);





useEffect(()=>{


if(providerId){

fetchData();

}


},[providerId]);





async function fetchData(){


try{


setLoading(true);



const {

data:{
user

}

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





console.log(
"PROVIDER DATA:",
providerData
);





if(providerError){

console.log(
providerError
);

setError(
"Failed loading provider"
);

return;

}





if(!providerData){


setError(
"Provider not found"
);


return;


}





setProvider(providerData);





if(
user &&
providerData.user_id===user.id

){

setIsOwnProfile(true);

}







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
const handleSubmitReview = async () => {


if(!currentUser){

setError("Please login to leave a review");

return;

}



if(isOwnProfile){

setError("You cannot review your own profile");

return;

}



if(!reviewText.trim()){

setError("Write a review");

return;

}



try{


setSubmitting(true);


const {

data,

error

}=await supabase


.from("reviews")


.insert([{

provider_id:Number(providerId),

rater_id:currentUser.id,

review:reviewText.trim()

}])


.select()


.single();





if(error) throw error;




setReviews([
data,
...reviews
]);



setReviewCount(
reviewCount+1
);



setReviewText("");

setSuccess(
"Review submitted"
);



}

catch(err:any){


setError(
err.message
);


}

finally{


setSubmitting(false);


}


};







const handleDeleteReview = async(id:string)=>{


const confirmDelete =
confirm(
"Delete this review?"
);



if(!confirmDelete) return;




const {

error

}=await supabase


.from("reviews")


.delete()


.eq(
"id",
id
);





if(error){

setError(
error.message
);

return;

}




setReviews(
reviews.filter(
r=>r.id!==id
)

);



setReviewCount(
reviewCount-1
);



};







const handleEditReview = async(id:string)=>{


const {

error

}=await supabase


.from("reviews")


.update({

review:
editingReviewText

})


.eq(
"id",
id
);





if(error){

setError(
error.message
);

return;

}





setReviews(

reviews.map(r=>

r.id===id

?

{

...r,

review:editingReviewText

}

:

r

)

);





setEditingReviewId(null);

setEditingReviewText("");



};









const handleCallNow=()=>{


if(provider?.phone){

window.location.href =
`tel:${provider.phone}`;

}


};







const handleWhatsApp=()=>{


if(provider?.phone){


window.open(

`https://wa.me/${provider.phone}`,

"_blank"

);


}


};








const handleEnquirySubmit =
async(e:React.FormEvent)=>{


e.preventDefault();



if(
!enquiryName ||
!enquiryPhone ||
!enquiryRequirements
){


setEnquiryError(
"Fill required fields"
);


return;

}





try{


setEnquirySubmitting(true);



const {

error

}=await supabase


.from("enquiries")


.insert([{

provider_id:Number(providerId),

rater_id:
currentUser?.id || null,

name:enquiryName,

phone:enquiryPhone,

event_type:enquiryEvent,

requirements:enquiryRequirements


}]);





if(error) throw error;




setEnquirySuccess(
"Enquiry sent successfully"
);



setEnquiryName("");

setEnquiryPhone("");

setEnquiryEvent("");

setEnquiryRequirements("");



setShowEnquiryForm(false);



}
catch(err:any){


setEnquiryError(
err.message
);


}
finally{


setEnquirySubmitting(false);


}


};







if(loading){


return(

<div className="
min-h-screen
flex
items-center
justify-center
">

Loading...

</div>

);


}






if(!provider){


return(

<div className="
min-h-screen
flex
items-center
justify-center
">

<h1 className="text-xl font-bold text-red-600">

{error || "Provider not found"}

</h1>


</div>

);


}
return (

<div className="min-h-screen bg-slate-50">


{/* HEADER */}

<div className="bg-white border-b">


<div className="max-w-5xl mx-auto p-6">


<div className="flex flex-col md:flex-row gap-5 items-center">


<div className="w-28 h-28 rounded-full overflow-hidden bg-slate-200">


{provider.profile_image ? (


<img

src={provider.profile_image}

alt={provider.name}

className="w-full h-full object-cover"

/>


):(


<div className="flex items-center justify-center h-full text-4xl">

{provider.name.charAt(0)}

</div>


)}


</div>





<div className="flex-1">


<div className="flex gap-2 items-center">


<h1 className="text-3xl font-bold">

{provider.name}

</h1>


{provider.verified && (

<CheckCircle
className="text-green-600"
/>

)}


</div>




<p className="text-slate-600">

{provider.category}

</p>



<p className="text-sm text-slate-500 flex gap-2 mt-2">

<MapPin size={16}/>

{provider.district}

</p>



</div>






<div className="flex gap-3">


<button

onClick={handleCallNow}

className="
bg-blue-600
text-white
px-5
py-3
rounded-xl
flex
gap-2
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
px-5
py-3
rounded-xl
flex
gap-2
"

>


<MessageCircle size={18}/>

WhatsApp


</button>


</div>




</div>


</div>


</div>








{/* MAIN */}


<div className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-6">





<div className="space-y-6">



<div className="bg-white rounded-3xl p-6 shadow">


<h2 className="text-xl font-bold mb-3">

About

</h2>


<p className="text-slate-600">

{provider.about || "No description"}

</p>


</div>







<div className="bg-white rounded-3xl p-6 shadow">


<h2 className="text-xl font-bold mb-3">

Skills

</h2>


<div className="flex flex-wrap gap-2">


{provider.skills?.map((skill,i)=>(


<span

key={i}

className="
bg-blue-50
text-blue-700
px-3
py-1
rounded-full
"

>

{skill}

</span>


))}


</div>


</div>




</div>







<div className="space-y-6">



<div className="bg-white rounded-3xl p-6 shadow">


<h2 className="font-bold text-xl mb-3">

Details

</h2>



<p>

📍 {provider.location || provider.district}

</p>


<p className="mt-3">

🏆 {provider.experience || "Experience not added"}

</p>



<p className="mt-3">

🌐 {provider.languages?.join(", ")}

</p>



</div>






<div className="bg-white rounded-3xl p-6 shadow">


<h2 className="font-bold text-xl mb-3">

Online

</h2>



{provider.website && (

<a

href={provider.website}

target="_blank"

className="text-blue-600 block"

>

Website

</a>

)}



{provider.youtube && (

<a

href={provider.youtube}

target="_blank"

className="text-red-600 block"

>

YouTube

</a>

)}



</div>



</div>




</div>









{/* REVIEWS */}


<div className="max-w-5xl mx-auto p-6">


<div className="bg-white rounded-3xl p-6 shadow">


<h2 className="text-xl font-bold mb-4">

Reviews ({reviewCount})

</h2>




{currentUser && !isOwnProfile && (


<div>


<textarea

value={reviewText}

onChange={
e=>setReviewText(e.target.value)
}

placeholder="Write review..."

className="
w-full
border
rounded-xl
p-3
"

/>


<button

onClick={handleSubmitReview}

disabled={submitting}

className="
mt-3
bg-blue-600
text-white
px-5
py-2
rounded-xl
"

>

Submit Review

</button>


</div>


)}






<div className="mt-6 space-y-4">


{
reviews.map(review=>(


<div

key={review.id}

className="
border-b
pb-4
"

>


<div className="flex justify-between">


<b>

{
review.rater_id===currentUser?.id
?
"You"
:
"User"
}

</b>




{
review.rater_id===currentUser?.id && (

<div className="flex gap-3">


<button

onClick={()=>handleDeleteReview(review.id)}

className="text-red-600"

>

<Trash2 size={16}/>

</button>


</div>

)

}


</div>




<p className="mt-2 text-slate-700">

{review.review}

</p>



</div>


))

}



</div>


</div>


</div>





</div>


);

}
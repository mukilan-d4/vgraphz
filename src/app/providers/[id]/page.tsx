"use client";

import { useEffect, useState } from "react";
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
  ChevronUp,
  ChevronDown,
  Edit,
  Trash2,
  X,
  Check,
  Globe,
  FolderOpen,
  Award,
  Languages,
  Truck,
  CheckCircle
} from "lucide-react";



interface Review {

  id:string;
  provider_id:number;
  rater_id:string;
  review:string;
  created_at:string;

}



export default function ProviderDetailPage(){


const params = useParams();

const providerId = params.id as string;



const [provider,setProvider]=useState<any>(null);

const [reviews,setReviews]=useState<Review[]>([]);

const [reviewCount,setReviewCount]=useState(0);


const [loading,setLoading]=useState(true);


const [currentUser,setCurrentUser]=useState<any>(null);


const [isOwnProfile,setIsOwnProfile]=useState(false);


const [reviewText,setReviewText]=useState("");


const [submitting,setSubmitting]=useState(false);


const [error,setError]=useState("");


const [success,setSuccess]=useState("");



const [editingReviewId,setEditingReviewId]=useState<string|null>(null);

const [editingReviewText,setEditingReviewText]=useState("");




const [showEnquiryForm,setShowEnquiryForm]=useState(false);



const [enquiryName,setEnquiryName]=useState("");

const [enquiryPhone,setEnquiryPhone]=useState("");

const [enquiryEvent,setEnquiryEvent]=useState("");

const [enquiryRequirements,setEnquiryRequirements]=useState("");

const [enquirySubmitting,setEnquirySubmitting]=useState(false);

const [enquirySuccess,setEnquirySuccess]=useState("");

const [enquiryError,setEnquiryError]=useState("");







useEffect(()=>{


loadData();


},[providerId]);







function convertArray(value:any){


if(!value) return [];


if(Array.isArray(value))
return value;



try{

const parsed=JSON.parse(value);

if(Array.isArray(parsed))
return parsed;


}catch{}



return String(value)
.split(",")
.map((x)=>x.trim())
.filter(Boolean);



}








async function loadData(){


try{


setLoading(true);



const {data:{user}} =
await supabase.auth.getUser();



setCurrentUser(user);






const {data:providerData,error:providerError}=

await supabase

.from("videographers")

.select("*")

.eq("id",providerId)

.single();





console.log("PROVIDER DATA:",providerData);





if(providerError){

console.log(providerError);

setProvider(null);

return;

}




setProvider(providerData);





if(user && providerData.user_id===user.id){

setIsOwnProfile(true);

}






const {data:reviewsData}=

await supabase

.from("reviews")

.select("*")

.eq("provider_id",Number(providerId))

.order("created_at",{ascending:false});





setReviews(reviewsData || []);

setReviewCount(reviewsData?.length || 0);





}

catch(err){

console.log(err);


}

finally{


setLoading(false);


}



}






const skills = convertArray(provider?.skills);

const languages = convertArray(provider?.languages);





async function handleSubmitReview(){


if(!currentUser){

setError("Please login to leave a review");

return;

}



if(isOwnProfile){

setError("You cannot review your own profile");

return;

}



if(!reviewText.trim()){

setError("Please write a review");

return;

}



try{


setSubmitting(true);


const {data,error}=await supabase

.from("reviews")

.insert({

provider_id:Number(providerId),

rater_id:currentUser.id,

review:reviewText.trim()

})

.select()

.single();





if(error) throw error;




setReviews([data,...reviews]);

setReviewCount(reviewCount+1);

setReviewText("");

setSuccess("Review submitted successfully");



setTimeout(()=>setSuccess(""),3000);



}

catch(err:any){

setError(err.message);

}

finally{


setSubmitting(false);


}



}









function startEditing(review:Review){


setEditingReviewId(review.id);

setEditingReviewText(review.review);


}







async function handleEditReview(id:string){



if(!editingReviewText.trim())
return;



const {error}=await supabase

.from("reviews")

.update({

review:editingReviewText.trim()

})

.eq("id",id);





if(error){

setError(error.message);

return;

}




setReviews(

reviews.map((r)=>

r.id===id

?

{

...r,

review:editingReviewText.trim()

}

:

r

)

);



setEditingReviewId(null);

setEditingReviewText("");



}









async function handleDeleteReview(id:string){


const ok=confirm(
"Delete this review?"
);


if(!ok) return;





const {error}=await supabase

.from("reviews")

.delete()

.eq("id",id);





if(error){

setError(error.message);

return;

}





setReviews(

reviews.filter((r)=>r.id!==id)

);



setReviewCount(reviewCount-1);



}









async function handleEnquirySubmit(
e:React.FormEvent
){


e.preventDefault();



if(

!enquiryName ||

!enquiryPhone ||

!enquiryRequirements

){

setEnquiryError(
"Please fill required fields"
);

return;

}



try{


setEnquirySubmitting(true);



const {error}=await supabase

.from("enquiries")

.insert({

provider_id:Number(providerId),

rater_id:currentUser?.id || null,

name:enquiryName,

phone:enquiryPhone,

event_type:enquiryEvent,

requirements:enquiryRequirements

});





if(error) throw error;





setEnquirySuccess(
"Enquiry sent successfully"
);



setEnquiryName("");

setEnquiryPhone("");

setEnquiryEvent("");

setEnquiryRequirements("");



}

catch(err:any){

setEnquiryError(err.message);

}

finally{


setEnquirySubmitting(false);


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






function handleCall(){


if(provider?.phone){


window.location.href=

`tel:${provider.phone}`;


}



}






if(loading){


return(

<div className="min-h-screen flex items-center justify-center">

Loading...

</div>

)


}







if(!provider){


return(

<div className="min-h-screen flex items-center justify-center">

Provider not found

</div>

)


}
return (

<div className="min-h-screen bg-slate-50">


{/* HEADER */}

<div className="bg-white border-b">

<div className="max-w-4xl mx-auto px-4 py-6">


<div className="flex flex-col md:flex-row gap-5 items-center">



<div className="w-24 h-24 rounded-full overflow-hidden bg-slate-200">

{

provider.profile_image ?

<img

src={provider.profile_image}

className="w-full h-full object-cover"

/>

:

<div className="w-full h-full flex items-center justify-center text-3xl">

{provider.name?.charAt(0)}

</div>

}


</div>





<div className="flex-1">


<div className="flex items-center gap-2">


<h1 className="text-3xl font-bold">

{provider.name}

</h1>


{

provider.verified &&

<CheckCircle size={20} className="text-green-600"/>

}


</div>



<p className="text-blue-600 font-semibold">

{provider.category}

</p>



<div className="flex gap-4 mt-2 text-sm text-slate-600">


<span className="flex gap-1">

<MapPin size={16}/>

{provider.district}

</span>



<span>

{reviewCount} Reviews

</span>


</div>



</div>






<div className="flex gap-2">


<button

onClick={handleCall}

className="bg-blue-600 text-white px-4 py-2 rounded-xl flex gap-2"

>

<Phone size={16}/>

Call

</button>



<button

onClick={handleWhatsApp}

className="bg-green-600 text-white px-4 py-2 rounded-xl flex gap-2"

>

<MessageCircle size={16}/>

WhatsApp

</button>



<button

onClick={()=>setShowEnquiryForm(!showEnquiryForm)}

className="bg-purple-600 text-white px-4 py-2 rounded-xl flex gap-2"

>

<Send size={16}/>

Enquiry

</button>



</div>



</div>






{

showEnquiryForm &&

<form

onSubmit={handleEnquirySubmit}

className="mt-5 bg-slate-50 p-5 rounded-2xl space-y-3"

>



<input

placeholder="Your Name"

value={enquiryName}

onChange={(e)=>setEnquiryName(e.target.value)}

className="w-full border rounded-xl p-3"

/>



<input

placeholder="Phone"

value={enquiryPhone}

onChange={(e)=>setEnquiryPhone(e.target.value)}

className="w-full border rounded-xl p-3"

/>



<input

placeholder="Event Type"

value={enquiryEvent}

onChange={(e)=>setEnquiryEvent(e.target.value)}

className="w-full border rounded-xl p-3"

/>



<textarea

placeholder="Requirements"

value={enquiryRequirements}

onChange={(e)=>setEnquiryRequirements(e.target.value)}

className="w-full border rounded-xl p-3"

/>



<button

disabled={enquirySubmitting}

className="bg-blue-600 text-white px-5 py-3 rounded-xl"

>

{enquirySubmitting ? "Sending..." : "Send Enquiry"}

</button>



</form>


}




</div>


</div>







{/* MAIN */}


<div className="max-w-4xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-6">







{/* ABOUT */}


<div className="bg-white rounded-3xl shadow-sm border p-6">


<h2 className="text-xl font-bold mb-3">

About

</h2>


<p className="text-slate-600">

{provider.about || "No description"}

</p>


</div>








{/* LOCATION */}


<div className="bg-white rounded-3xl shadow-sm border p-6">


<h2 className="text-xl font-bold flex gap-2">

<MapPin/>

Location

</h2>



<p className="mt-3 text-slate-600">

{provider.location || provider.district}

</p>



{

provider.state &&

<p className="mt-2">

State: {provider.state}

</p>

}



</div>








{/* SKILLS */}


<div className="bg-white rounded-3xl shadow-sm border p-6">


<h2 className="text-xl font-bold">

Skills & Expertise

</h2>



<div className="flex flex-wrap gap-2 mt-4">


{

skills.length ?

skills.map((skill:string,i:number)=>(


<span

key={i}

className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full"

>

{skill}

</span>


))

:

<p>No skills added</p>


}



</div>



</div>








{/* EXPERIENCE */}


<div className="bg-white rounded-3xl shadow-sm border p-6">


<h2 className="text-xl font-bold flex gap-2">

<Award/>

Experience

</h2>


<p className="mt-3 text-slate-600">

{provider.experience || "Not added"} Years

</p>



</div>







{/* LANGUAGES */}


<div className="bg-white rounded-3xl shadow-sm border p-6">


<h2 className="text-xl font-bold flex gap-2">

<Languages/>

Languages

</h2>



<div className="flex flex-wrap gap-2 mt-4">


{

languages.length ?

languages.map((lang:string,i:number)=>(


<span

key={i}

className="bg-green-50 text-green-700 px-3 py-1 rounded-full"

>

{lang}

</span>


))

:

<p>No languages added</p>

}



</div>


</div>

{/* ONLINE PRESENCE */}

<div className="bg-white rounded-3xl shadow-sm border p-6">


<h2 className="text-xl font-bold flex gap-2">

<Globe/>

Online Presence

</h2>



<div className="flex flex-wrap gap-3 mt-4">


{

provider.website &&

<a

href={provider.website}

target="_blank"

className="bg-slate-100 px-4 py-2 rounded-xl"

>

Website

</a>

}



{

provider.youtube &&

<a

href={provider.youtube}

target="_blank"

className="bg-red-100 px-4 py-2 rounded-xl"

>

YouTube

</a>

}



{

provider.instagram &&

<a

href={provider.instagram}

target="_blank"

className="bg-pink-100 px-4 py-2 rounded-xl"

>

Instagram

</a>

}



{

provider.portfolio &&

<a

href={provider.portfolio}

target="_blank"

className="bg-purple-100 px-4 py-2 rounded-xl"

>

Portfolio

</a>

}


</div>


</div>






{/* DELIVERY */}

{

(provider.delivery || provider.delivery_time) &&


<div className="bg-white rounded-3xl shadow-sm border p-6">


<h2 className="text-xl font-bold flex gap-2">

<Truck/>

Delivery

</h2>



<p className="mt-3 text-slate-600">

{provider.delivery || provider.delivery_time}

</p>


</div>


}



</div>








{/* REVIEWS */}



<div className="max-w-4xl mx-auto px-4 pb-10">


<div className="bg-white rounded-3xl shadow-sm border p-6">


<h2 className="text-xl font-bold">

Reviews ({reviewCount})

</h2>





{

currentUser && !isOwnProfile &&

<div className="mt-5">


<textarea

value={reviewText}

onChange={(e)=>setReviewText(e.target.value)}

placeholder="Write your review"

className="w-full border rounded-xl p-3"

rows={4}

/>



<button

onClick={handleSubmitReview}

disabled={submitting}

className="mt-3 bg-blue-600 text-white px-5 py-3 rounded-xl"

>

Submit Review

</button>


</div>


}




{

currentUser && isOwnProfile &&

<div className="mt-5 bg-yellow-50 p-4 rounded-xl">

You cannot review your own profile

</div>

}





{

!currentUser &&

<div className="mt-5 bg-slate-50 p-4 rounded-xl">

Please login to leave a review

</div>

}







<div className="mt-6 space-y-4">


{

reviews.length===0 ?

<p className="text-slate-500">

No reviews yet

</p>


:

reviews.map((review)=>(


<div

key={review.id}

className="border-b pb-4"

>


<div className="flex gap-2 items-center">


<User size={18}/>


<span className="font-semibold">

{

review.rater_id===currentUser?.id

?

"You"

:

"User"

}

</span>


</div>





{

editingReviewId===review.id ?

(

<div className="mt-3">


<textarea

value={editingReviewText}

onChange={(e)=>setEditingReviewText(e.target.value)}

className="w-full border rounded-xl p-2"

/>



<div className="flex gap-2 mt-2">


<button

onClick={()=>handleEditReview(review.id)}

className="bg-green-600 text-white px-3 py-2 rounded-xl flex gap-1"

>

<Check size={15}/>

Save

</button>



<button

onClick={()=>setEditingReviewId(null)}

className="border px-3 py-2 rounded-xl flex gap-1"

>

<X size={15}/>

Cancel

</button>


</div>



</div>

)


:

(

<>


<p className="mt-2">

{review.review}

</p>




{

review.rater_id===currentUser?.id &&

<div className="flex gap-4 mt-3">


<button

onClick={()=>{

setEditingReviewId(review.id);

setEditingReviewText(review.review);

}}

className="text-blue-600 flex gap-1"

>

<Edit size={14}/>

Edit

</button>




<button

onClick={()=>handleDeleteReview(review.id)}

className="text-red-600 flex gap-1"

>

<Trash2 size={14}/>

Delete

</button>


</div>


}



</>

)


}



</div>


))


}


</div>



</div>



</div>







{/* FOOTER */}


<footer className="bg-white border-t py-10 mt-10">


<div className="max-w-4xl mx-auto px-4">


<h3 className="text-xl font-bold">

VgraphZ

</h3>


<p className="text-slate-600 mt-2">

Discover trusted creative professionals.

</p>



<div className="mt-4 text-sm text-slate-500 space-y-2">


<p className="flex gap-2">

<Mail size={16}/>

support@vgraphz.com

</p>



<p className="flex gap-2">

<Clock size={16}/>

Mon - Sat | 9 AM - 7 PM

</p>


</div>


</div>


</footer>




</div>


);

}
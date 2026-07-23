"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";


export default function JoinProviderPage(){

const router = useRouter();


const [loading,setLoading] = useState(false);

const [error,setError] = useState("");

const [success,setSuccess] = useState("");



const [formData,setFormData] = useState({

category:"Videographer",

fullName:"",
companyName:"",
experience:"",
skills:"",

phone:"",
whatsapp:"",
email:"",

state:"Tamil Nadu",
district:"",
area:"",
fullAddress:"",

googleMaps:"",

website:"",
instagram:"",
portfolio:"",
youtube:"",

about:""

});



const tamilNaduDistricts=[

"Ariyalur",
"Chengalpattu",
"Chennai",
"Coimbatore",
"Cuddalore",
"Dharmapuri",
"Dindigul",
"Erode",
"Kallakurichi",
"Kancheepuram",
"Karur",
"Krishnagiri",
"Madurai",
"Mayiladuthurai",
"Nagapattinam",
"Namakkal",
"Nilgiris",
"Perambalur",
"Pudukkottai",
"Ramanathapuram",
"Ranipet",
"Salem",
"Sivaganga",
"Tenkasi",
"Thanjavur",
"Theni",
"Thoothukudi",
"Tiruchirappalli",
"Tirunelveli",
"Tirupathur",
"Tiruppur",
"Tiruvallur",
"Tiruvannamalai",
"Tiruvarur",
"Trichy",
"Vellore",
"Viluppuram",
"Virudhunagar"

];



function handleChange(
e:
React.ChangeEvent<
HTMLInputElement |
HTMLTextAreaElement |
HTMLSelectElement
>
){


setFormData({

...formData,

[e.target.name]:e.target.value

});


}
async function handleSubmit(
e:React.FormEvent
){

e.preventDefault();


if(loading) return;



setError("");

setSuccess("");



if(!formData.fullName.trim()){

setError("Please enter your full name");

return;

}



if(!formData.phone.trim()){

setError("Please enter phone number");

return;

}



if(!formData.district){

setError("Please select district");

return;

}



if(!formData.area.trim()){

setError("Please enter area/city");

return;

}



if(!formData.about.trim()){

setError("Please add about your service");

return;

}



try{


setLoading(true);



const {

data:{
user
}

}=await supabase.auth.getUser();




if(!user){

setError(
"Please login before submitting your profile"
);

return;

}





// CHECK EXISTING PROVIDER PROFILE

const {

data:existingProvider,

error:checkError

}=await supabase

.from("videographers")

.select("id,status")

.eq(
"user_id",
user.id
)

.maybeSingle();




if(checkError){

console.log(
"Check error:",
checkError
);

}





if(existingProvider){


setError(
"You already submitted a provider profile. Please wait for approval."
);


return;


}





// Convert skills string to array

const skillsArray =

formData.skills

.split(",")

.map(
(skill)=>skill.trim()
)

.filter(Boolean);






const {

error:insertError

}=await supabase

.from("videographers")

.insert([{


user_id:user.id,


name:
formData.fullName.trim(),



email:
formData.email.trim()
||
user.email,



category:
formData.category,



company_name:
formData.companyName.trim()
||
null,



experience:
formData.experience
||
null,



skills:
skillsArray,



phone:
formData.phone.trim(),



whatsapp:
formData.whatsapp.trim()
||
null,



state:
formData.state,



district:
formData.district,



area:
formData.area.trim(),



full_address:
formData.fullAddress.trim()
||
null,



google_maps:
formData.googleMaps.trim()
||
null,



website:
formData.website.trim()
||
null,



instagram:
formData.instagram.trim()
||
null,



portfolio:
formData.portfolio.trim()
||
null,



youtube:
formData.youtube.trim()
||
null,



about:
formData.about.trim(),



status:"pending",



approved:false



}]);





if(insertError){



if(insertError.code==="23505"){


setError(
"You already have a provider profile. Please wait for approval."
);


}

else{


setError(
insertError.message
);


}



return;


}



setSuccess(
"Your profile submitted successfully. Admin will review and approve it."
);




setTimeout(()=>{

router.push("/providers");

},3000);



}catch(err:any){


console.log(err);


setError(
err.message ||
"Something went wrong"
);



}

finally{


setLoading(false);


}


}
return (

<div className="min-h-screen bg-slate-50">


{/* Header */}

<div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">


<div className="max-w-4xl mx-auto px-4 text-center">


<h1 className="text-4xl font-bold">

Join VgraphZ

</h1>


<p className="text-blue-100 mt-2 text-lg">

Register your creative service and get customer enquiries

</p>


</div>


</div>





<div className="max-w-4xl mx-auto px-4 py-8">


<div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">



{
error &&

<div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-6">


<p className="text-red-600 text-sm font-medium">

{error}

</p>


</div>

}





{
success &&

<div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 mb-6">


<p className="text-green-600 text-sm font-medium">

{success}

</p>


</div>

}





<form
onSubmit={handleSubmit}
className="space-y-6"
>



{/* Category */}


<div>


<label className="block text-sm font-semibold text-slate-700 mb-2">

Category *

</label>



<select

name="category"

value={formData.category}

onChange={handleChange}

className="w-full rounded-2xl border border-slate-200 px-4 py-3"

>


<option>
Videographer
</option>


<option>
Photographer
</option>


<option>
Video Editor
</option>


<option>
Photo Editor
</option>


<option>
Drone Pilot
</option>



</select>


</div>





{/* Name */}


<div>


<label className="block text-sm font-semibold text-slate-700 mb-2">

Full Name *

</label>


<input

type="text"

name="fullName"

value={formData.fullName}

onChange={handleChange}

placeholder="Enter your name"

className="w-full rounded-2xl border border-slate-200 px-4 py-3"

required

/>


</div>






{/* Company */}


<div>


<label className="block text-sm font-semibold text-slate-700 mb-2">

Company / Studio Name

</label>



<input

type="text"

name="companyName"

value={formData.companyName}

onChange={handleChange}

placeholder="Optional"

className="w-full rounded-2xl border border-slate-200 px-4 py-3"

/>


</div>







{/* Experience + Skills */}


<div className="grid grid-cols-1 md:grid-cols-2 gap-4">



<div>


<label className="block text-sm font-semibold text-slate-700 mb-2">

Experience *

</label>


<input

type="text"

name="experience"

value={formData.experience}

onChange={handleChange}

placeholder="Example: 5 Years"

className="w-full rounded-2xl border border-slate-200 px-4 py-3"

required

/>


</div>






<div>


<label className="block text-sm font-semibold text-slate-700 mb-2">

Skills *

</label>


<input

type="text"

name="skills"

value={formData.skills}

onChange={handleChange}

placeholder="Wedding, Editing, Reels"

className="w-full rounded-2xl border border-slate-200 px-4 py-3"

required

/>


</div>



</div>






{/* Phone */}

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">


<div>


<label className="block text-sm font-semibold text-slate-700 mb-2">

Phone Number *

</label>


<input

type="tel"

name="phone"

value={formData.phone}

onChange={handleChange}

placeholder="Phone number"

className="w-full rounded-2xl border border-slate-200 px-4 py-3"

required

/>


</div>





<div>


<label className="block text-sm font-semibold text-slate-700 mb-2">

WhatsApp Number

</label>



<input

type="tel"

name="whatsapp"

value={formData.whatsapp}

onChange={handleChange}

placeholder="WhatsApp number"

className="w-full rounded-2xl border border-slate-200 px-4 py-3"

/>


</div>



</div>





{/* Email */}


<div>


<label className="block text-sm font-semibold text-slate-700 mb-2">

Email

</label>


<input

type="email"

name="email"

value={formData.email}

onChange={handleChange}

placeholder="email@example.com"

className="w-full rounded-2xl border border-slate-200 px-4 py-3"

/>


</div>
{/* Location Details */}

<div>

<h3 className="text-lg font-semibold text-slate-900 mb-4">

Location Details

</h3>



<div className="grid grid-cols-1 md:grid-cols-2 gap-4">


<div>


<label className="block text-sm font-semibold text-slate-700 mb-2">

State

</label>


<select

name="state"

value={formData.state}

onChange={handleChange}

className="w-full rounded-2xl border border-slate-200 px-4 py-3"

>


<option value="Tamil Nadu">

Tamil Nadu

</option>


</select>


</div>






<div>


<label className="block text-sm font-semibold text-slate-700 mb-2">

District *

</label>


<select

name="district"

value={formData.district}

onChange={handleChange}

required

className="w-full rounded-2xl border border-slate-200 px-4 py-3"

>


<option value="">

Select District

</option>



{

tamilNaduDistricts.map((district)=>(


<option

key={district}

value={district}

>

{district}

</option>


))


}



</select>


</div>


</div>


</div>






{/* Area + Maps */}

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">


<div>


<label className="block text-sm font-semibold text-slate-700 mb-2">

Area / City *

</label>


<input

type="text"

name="area"

value={formData.area}

onChange={handleChange}

required

placeholder="Enter area"

className="w-full rounded-2xl border border-slate-200 px-4 py-3"

/>


</div>




<div>


<label className="block text-sm font-semibold text-slate-700 mb-2">

Google Maps Link

</label>


<input

type="url"

name="googleMaps"

value={formData.googleMaps}

onChange={handleChange}

placeholder="Google maps link"

className="w-full rounded-2xl border border-slate-200 px-4 py-3"

/>


</div>


</div>






{/* Full Address */}

<div>


<label className="block text-sm font-semibold text-slate-700 mb-2">

Full Address

</label>


<input

type="text"

name="fullAddress"

value={formData.fullAddress}

onChange={handleChange}

placeholder="Full address"

className="w-full rounded-2xl border border-slate-200 px-4 py-3"

/>


</div>








{/* Online Presence */}


<div>


<h3 className="text-lg font-semibold text-slate-900 mb-4">

Online Presence

</h3>



<div className="grid grid-cols-1 md:grid-cols-2 gap-4">


<input

type="url"

name="website"

value={formData.website}

onChange={handleChange}

placeholder="Website URL"

className="w-full rounded-2xl border border-slate-200 px-4 py-3"

/>



<input

type="url"

name="instagram"

value={formData.instagram}

onChange={handleChange}

placeholder="Instagram URL"

className="w-full rounded-2xl border border-slate-200 px-4 py-3"

/>



<input

type="url"

name="portfolio"

value={formData.portfolio}

onChange={handleChange}

placeholder="Portfolio URL"

className="w-full rounded-2xl border border-slate-200 px-4 py-3"

/>



<input

type="url"

name="youtube"

value={formData.youtube}

onChange={handleChange}

placeholder="YouTube URL"

className="w-full rounded-2xl border border-slate-200 px-4 py-3"

/>



</div>


</div>






{/* About */}


<div>


<label className="block text-sm font-semibold text-slate-700 mb-2">

About Your Services *

</label>


<textarea

name="about"

value={formData.about}

onChange={handleChange}

rows={6}

required

placeholder="Describe your services"

className="w-full rounded-2xl border border-slate-200 px-4 py-3 resize-none"

/>


</div>








{/* Submit Button */}


<button

type="submit"

disabled={loading}

className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 px-6 py-4 text-white font-semibold transition disabled:opacity-50"

>


{

loading

?

"Submitting..."

:

"Submit For Approval"

}


</button>





</form>


</div>


</div>


</div>


);


}
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";


export default function ProviderEditPage(){

const params = useParams();
const router = useRouter();

const id = params.id as string;


const [loading,setLoading] = useState(true);


const [form,setForm] = useState<any>({

name:"",
category:"",
district:"",
state:"",
about:"",
skills:"",
languages:"",
website:"",
youtube:"",
instagram:"",
portfolio:"",
experience:"",
delivery_time:"",
phone:""

});





useEffect(()=>{

loadProvider();

},[]);





async function loadProvider(){


const {data,error}=await supabase

.from("videographers")

.select("*")

.eq("id",id)

.single();



if(error){

console.log(error);

return;

}



setForm({

name:data.name || "",

category:data.category || "",

district:data.district || "",

state:data.state || "",

about:data.about || "",


skills:Array.isArray(data.skills)

? data.skills.join(", ")

: data.skills || "",



languages:Array.isArray(data.languages)

? data.languages.join(", ")

: data.languages || "",



website:data.website || "",

youtube:data.youtube || "",

instagram:data.instagram || "",

portfolio:data.portfolio || "",

experience:data.experience || "",

delivery_time:data.delivery_time || "",

phone:data.phone || ""

});



setLoading(false);


}






function handleChange(e:any){


setForm({

...form,

[e.target.name]:e.target.value

});


}







function convertToArray(value:string){


return value

.split(",")

.map((x:string)=>x.trim())

.filter(Boolean);


}








async function updateProvider(){


const {error}=await supabase

.from("videographers")

.update({

name:form.name,

category:form.category,

district:form.district,

state:form.state,

about:form.about,


skills:convertToArray(form.skills),


languages:convertToArray(form.languages),



website:form.website,

youtube:form.youtube,

instagram:form.instagram,

portfolio:form.portfolio,


experience:form.experience,


delivery_time:form.delivery_time,


phone:form.phone


})

.eq("id",id);




if(error){

alert(error.message);

return;

}



alert("Profile Updated Successfully");


router.push(`/providers/${id}`);


}






if(loading){

return(

<div className="min-h-screen flex items-center justify-center">

Loading...

</div>

)

}







return(


<div className="min-h-screen bg-slate-50 py-12">


<div className="max-w-3xl mx-auto bg-white rounded-3xl shadow p-8">


<h1 className="text-3xl font-bold mb-8">

Edit Provider Profile

</h1>





{

[

["name","Name"],

["category","Category"],

["district","District"],

["state","State"],

["experience","Experience"],

["phone","Phone"],

["website","Website"],

["youtube","YouTube"],

["instagram","Instagram"],

["portfolio","Portfolio"],

["delivery_time","Delivery Time"]

].map(([key,label])=>(


<div key={key} className="mb-4">


<label className="font-semibold">

{label}

</label>


<input

name={key}

value={form[key]}

onChange={handleChange}

className="
w-full
mt-2
border
rounded-xl
px-4
py-3
"

/>


</div>


))

}






<div className="mb-4">


<label className="font-semibold">

About

</label>


<textarea

name="about"

value={form.about}

onChange={handleChange}

rows={5}

className="
w-full
mt-2
border
rounded-xl
px-4
py-3
"

/>


</div>






<div className="mb-4">


<label className="font-semibold">

Skills

</label>


<input

name="skills"

value={form.skills}

onChange={handleChange}

placeholder="Example: Video Editing, Python, React"

className="
w-full
mt-2
border
rounded-xl
px-4
py-3
"

/>


</div>






<div className="mb-4">


<label className="font-semibold">

Languages

</label>


<input

name="languages"

value={form.languages}

onChange={handleChange}

placeholder="Example: Tamil, English"

className="
w-full
mt-2
border
rounded-xl
px-4
py-3
"

/>


</div>







<button

onClick={updateProvider}

className="
w-full
bg-blue-600
text-white
py-4
rounded-xl
font-bold
"

>


Save Changes


</button>





</div>


</div>


)

}
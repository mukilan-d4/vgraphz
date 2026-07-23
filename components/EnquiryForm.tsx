"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";


export default function EnquiryForm({

providerId

}:{

providerId:number

}) {


const [form,setForm]=useState({

name:"",
phone:"",
event:"",
message:""

});


const [status,setStatus]=useState("");



async function submitEnquiry(){


const {error}=await supabase

.from("enquiries")

.insert([

{

provider_id:providerId,

customer_name:form.name,

customer_phone:form.phone,

event_type:form.event,

message:form.message

}

]);



if(error){

console.log("ENQUIRY ERROR:", error);

setStatus(error.message);

}

else{

setStatus("Enquiry sent successfully");

setForm({

name:"",
phone:"",
event:"",
message:""

});

}


}



return (

<div className="
mt-10
rounded-xl
bg-gray-100
p-6
">


<h2 className="
text-2xl
font-bold
">

Send Enquiry

</h2>



<input

className="
mt-4
w-full
rounded
border
p-3
"

placeholder="Your Name"

value={form.name}

onChange={(e)=>

setForm({

...form,

name:e.target.value

})

}

/>



<input

className="
mt-3
w-full
rounded
border
p-3
"

placeholder="Phone Number"

value={form.phone}

onChange={(e)=>

setForm({

...form,

phone:e.target.value

})

}

/>



<input

className="
mt-3
w-full
rounded
border
p-3
"

placeholder="Event Type (Wedding, Birthday, Corporate)"

value={form.event}

onChange={(e)=>

setForm({

...form,

event:e.target.value

})

}

/>



<textarea

className="
mt-3
w-full
rounded
border
p-3
"

placeholder="Message"

value={form.message}

onChange={(e)=>

setForm({

...form,

message:e.target.value

})

}

/>



<button

onClick={submitEnquiry}

className="
mt-4
w-full
rounded-lg
bg-blue-600
py-3
text-white
"

>

Send Enquiry

</button>



<p className="mt-3 text-center">

{status}

</p>


</div>

);


}
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";


export default function ProviderRegister(){


const router = useRouter();


const [email,setEmail]=useState("");

const [password,setPassword]=useState("");

const [message,setMessage]=useState("");



async function register(){


const {data,error}=await supabase.auth.signUp({

email,

password

});



if(error){

setMessage(error.message);

return;

}



setMessage(
"Account created. Check email verification."
);



router.push("/provider-login");


}




return (

<main className="
min-h-screen
bg-gray-100
flex
items-center
justify-center
">


<div className="
w-full
max-w-md
rounded-xl
bg-white
p-8
shadow
">


<h1 className="
text-3xl
font-bold
">

Create Provider Account

</h1>



<p className="
mt-2
text-gray-600
">

Use your email to manage enquiries

</p>




<input

className="
mt-6
w-full
rounded
border
p-3
"

placeholder="Email"

value={email}

onChange={(e)=>
setEmail(e.target.value)
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

placeholder="Password"

type="password"

value={password}

onChange={(e)=>
setPassword(e.target.value)
}

/>




<button

onClick={register}

className="
mt-5
w-full
rounded-lg
bg-blue-600
py-3
text-white
"

>

Create Account

</button>



<p className="
mt-4
text-center
">

{message}

</p>



</div>


</main>

);


}
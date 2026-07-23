"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";


export default function ProviderLogin(){


const router = useRouter();


const [email,setEmail]=useState("");

const [password,setPassword]=useState("");

const [message,setMessage]=useState("");



async function login(){


const {error}=await supabase.auth.signInWithPassword({

email,

password

});



if(error){

setMessage(error.message);

}

else{

router.push("/provider-dashboard");

}


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
bg-white
rounded-xl
p-8
shadow
w-full
max-w-md
">


<h1 className="
text-3xl
font-bold
">

Provider Login

</h1>



<input

className="
mt-5
w-full
border
rounded
p-3
"

placeholder="Email"

value={email}

onChange={(e)=>setEmail(e.target.value)}

/>



<input

className="
mt-3
w-full
border
rounded
p-3
"

placeholder="Password"

type="password"

value={password}

onChange={(e)=>setPassword(e.target.value)}

/>



<button

onClick={login}

className="
mt-5
w-full
rounded-lg
bg-black
py-3
text-white
"

>

Login

</button>



<p className="
mt-3
text-center
">

{message}

</p>


</div>


</main>

);


}
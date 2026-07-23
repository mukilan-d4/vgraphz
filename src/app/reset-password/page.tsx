"use client";


import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";


export default function ResetPasswordPage(){

const router = useRouter();


const [password,setPassword] = useState("");

const [message,setMessage] = useState("");

const [loading,setLoading] = useState(false);



async function updatePassword(){


setLoading(true);


const {error}=await supabase.auth.updateUser({

password

});



if(error){

setMessage(error.message);

setLoading(false);

return;

}



setMessage(
"Password changed successfully"
);



setTimeout(()=>{

router.push("/login");

},1500);



}



return(

<main className="
min-h-screen bg-slate-50 
flex items-center justify-center px-4
">


<div className="
bg-white rounded-3xl shadow 
p-8 w-full max-w-md
">


<h1 className="
text-3xl font-bold
">

Create New Password

</h1>



<p className="
text-slate-600 mt-2
">

Enter your new password

</p>



<input

type="password"

placeholder="New password"

value={password}

onChange={(e)=>setPassword(e.target.value)}

className="
mt-6 w-full border rounded-xl
px-4 py-3
"

/>



<button

onClick={updatePassword}

disabled={loading}

className="
mt-4 w-full bg-blue-600
text-white rounded-xl py-3
font-semibold
"

>

{
loading
?
"Updating..."
:
"Reset Password"
}


</button>



{
message &&
<p className="mt-4 text-green-600">
{message}
</p>
}



</div>


</main>

)


}
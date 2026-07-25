"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { supabase } from "@/lib/supabase";


export default function Navbar() {


  const [open, setOpen] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);

  const [user, setUser] = useState<any>(null);



  useEffect(() => {

    loadUser();

  }, []);





  async function loadUser() {


    const {
      data: {
        user
      }
    } = await supabase.auth.getUser();



    if (user) {


      const {
        data: profile
      } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();



      setUser({

        ...profile,

        email:user.email

      });


    }


  }





  async function logout() {


    await supabase.auth.signOut();


    window.location.href="/login";


  }





  return (


<nav
className="
sticky
top-0
z-50
border-b
border-zinc-800
bg-black/70
backdrop-blur-xl
">


<div
className="
mx-auto
max-w-7xl
px-5
py-4
flex
items-center
justify-between
">





<Link

href="/"

className="
text-3xl
font-extrabold
tracking-tight
"

>

<span className="text-white">
Vgraph
</span>

<span className="text-zinc-400">
Z
</span>

</Link>







{/* Desktop Menu */}


<div
className="
hidden
md:flex
items-center
gap-8
"
>


<Link

href="/"

className="
text-zinc-300
hover:text-white
transition
"

>

Home

</Link>





<Link

href="/providers"

className="
text-zinc-300
hover:text-white
transition
"

>

Providers

</Link>







<Link

href="/register"

className="
rounded-xl
bg-white
text-black
px-5
py-2
font-semibold
hover:bg-zinc-200
transition
"

>

Join Now

</Link>







{
user ? (



<div
className="
relative
"
>


<button

onClick={()=>
setProfileOpen(!profileOpen)
}

>

<img

src={
user.profile_image ||
"/default-profile.png"
}

alt="Profile"

className="
w-11
h-11
rounded-full
object-cover
border
border-zinc-700
cursor-pointer
"

/>


</button>







{
profileOpen && (


<div

className="
absolute
right-0
mt-3
w-64
bg-white
rounded-2xl
shadow-2xl
p-5
text-black
"

>


<div
className="
border-b
pb-4
mb-3
"
>


<p
className="
font-bold
text-lg
"
>

{
user.name || "User"
}

</p>



<p
className="
text-sm
text-gray-500
break-all
"
>

{
user.email
}

</p>


</div>






<Link

href="/profile"

className="
block
px-3
py-2
rounded-xl
hover:bg-gray-100
"

>

👤 View Profile

</Link>





<Link

href="/edit-profile"

className="
block
px-3
py-2
rounded-xl
hover:bg-gray-100
"

>

✏️ Edit Profile

</Link>






{
user.role === "provider" && (

<Link

href="/provider-dashboard"

className="
block
px-3
py-2
rounded-xl
hover:bg-gray-100
"

>

🎥 Provider Dashboard

</Link>

)

}





{
user.role === "admin" && (

<Link

href="/admin"

className="
block
px-3
py-2
rounded-xl
hover:bg-gray-100
"

>

⚡ Admin Dashboard

</Link>

)

}







<button

onClick={logout}

className="
w-full
text-left
px-3
py-2
rounded-xl
hover:bg-gray-100
text-red-600
"

>

🚪 Logout

</button>





</div>


)

}


</div>



)

:(



<Link

href="/login"

className="
text-zinc-300
hover:text-white
transition
"

>

Login

</Link>


)

}




</div>







{/* Mobile Menu Button */}


<button

onClick={()=>setOpen(!open)}

className="
md:hidden
text-white
"

>


{
open ?

<X size={28}/>

:

<Menu size={28}/>

}


</button>




</div>









{/* Mobile Menu */}



{

open && (


<div

className="
md:hidden
border-t
border-zinc-800
px-5
py-5
space-y-4
"

>


<Link

href="/"

className="
block
text-zinc-300
"

>

Home

</Link>





<Link

href="/providers"

className="
block
text-zinc-300
"

>

Providers

</Link>






<Link

href="/register"

className="
block
text-red-500
"

>

Join Now

</Link>






{
user ? (


<>


<Link

href="/profile"

className="
block
text-white
"

>

Profile

</Link>



<button

onClick={logout}

className="
block
text-red-500
"

>

Logout

</button>


</>


)

:(


<Link

href="/login"

className="
block
text-zinc-300
"

>

Login

</Link>


)

}





</div>


)

}



</nav>


  );

}
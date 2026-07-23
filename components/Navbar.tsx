"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";


export default function Navbar(){

const [open,setOpen]=useState(false);


return (

<nav className="
sticky
top-0
z-50
border-b
border-zinc-800
bg-black/70
backdrop-blur-xl
">


<div className="
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



<div className="
hidden
md:flex
items-center
gap-8
">


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


</div>



<button

onClick={()=>setOpen(!open)}

className="
md:hidden
text-white
"

>

{
open ?

<X size={28}/> :

<Menu size={28}/>

}

</button>


</div>



{
open &&

<div className="
md:hidden
border-t
border-zinc-800
px-5
py-5
space-y-4
">


<Link
href="/"
className="block text-zinc-300"
>
Home
</Link>


<Link
href="/providers"
className="block text-zinc-300"
>
Providers
</Link>


<Link
href="/register"
className="block text-red-500"
>
Join Now
</Link>


<Link
href="/login"
className="block text-zinc-300"
>
Login
</Link>


</div>

}


</nav>

);

}
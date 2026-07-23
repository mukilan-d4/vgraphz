"use client";


export default function ErrorPage({

reset,

}:{

reset:()=>void

}){


return (

<main className="
min-h-screen
bg-zinc-950
flex
items-center
justify-center
px-5
text-center
">


<div>


<h1 className="
text-5xl
font-bold
text-white
">

Something went wrong

</h1>


<p className="
mt-5
text-zinc-400
">

We couldn't load this page. Please try again.

</p>



<button

onClick={()=>reset()}

className="
mt-8
rounded-xl
bg-white
px-8
py-3
font-bold
text-black
hover:bg-zinc-200
transition
"

>

Try Again

</button>



</div>


</main>

)

}
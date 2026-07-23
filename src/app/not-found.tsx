import Link from "next/link";


export default function NotFound(){

return (

<main className="
min-h-screen
bg-zinc-950
flex
items-center
justify-center
text-center
px-5
">


<div>

<h1 className="
text-7xl
font-bold
text-white
">

404

</h1>


<p className="
mt-5
text-2xl
text-zinc-400
">

Page not found

</p>


<Link

href="/"

className="
inline-block
mt-8
rounded-xl
bg-white
px-8
py-3
font-bold
text-black
"

>

Back Home

</Link>


</div>


</main>

)

}
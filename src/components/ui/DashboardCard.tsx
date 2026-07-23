import React from "react";

interface DashboardCardProps {
  title:string;
  value:string | number;
  icon?:React.ReactNode;
}

export default function DashboardCard({
title,
value,
icon
}:DashboardCardProps){

return (

<div

className="
rounded-3xl
border
border-zinc-800
bg-zinc-900
p-6
shadow-xl
transition-all
duration-300
hover:-translate-y-1
hover:border-red-500/40
"

>

<div className="
flex
items-center
justify-between
">

<div>

<p className="
text-sm
text-zinc-400
">

{title}

</p>


<h3 className="
mt-3
text-4xl
font-bold
text-white
">

{value}

</h3>

</div>


{
icon &&

<div className="
rounded-2xl
bg-red-600/10
p-4
text-red-500
">

{icon}

</div>

}

</div>

</div>

);

}
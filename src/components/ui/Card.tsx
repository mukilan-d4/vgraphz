import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({
  children,
  className = ""
}: CardProps){

return (

<div

className={`
rounded-3xl
border
border-zinc-800
bg-zinc-900
p-6
shadow-2xl
transition-all
duration-300
hover:-translate-y-1
hover:shadow-red-500/10
${className}
`}

>

{children}

</div>

);

}
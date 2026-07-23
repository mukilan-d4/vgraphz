import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
}

export default function Button({
  children,
  className = "",
  type="button"
}: ButtonProps){

return (

<button
type={type}
className={`
rounded-xl
bg-red-600
px-6
py-3
font-semibold
text-white
transition-all
duration-300
hover:bg-red-700
hover:scale-105
active:scale-95
${className}
`}
>

{children}

</button>

);

}
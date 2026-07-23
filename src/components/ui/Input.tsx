import React from "react";

interface InputProps 
extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Input({
className="",
...props
}:InputProps){

return (

<input

className={`
w-full
rounded-xl
border
border-zinc-700
bg-zinc-950
p-4
text-white
placeholder:text-zinc-500
outline-none
transition
focus:border-red-500
focus:ring-2
focus:ring-red-500/30
${className}
`}

{...props}

/>

);

}
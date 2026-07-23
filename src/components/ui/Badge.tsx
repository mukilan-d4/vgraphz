import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "danger" | "premium";
}

export default function Badge({
  children,
  variant="success"
}: BadgeProps){

const styles = {

success:
"bg-green-500/10 text-green-400 border-green-500/20",

danger:
"bg-red-500/10 text-red-400 border-red-500/20",

premium:
"bg-yellow-500/10 text-yellow-400 border-yellow-500/20"

};


return (

<span

className={`
inline-flex
items-center
rounded-full
border
px-4
py-1
text-sm
font-semibold
${styles[variant]}
`}

>

{children}

</span>

);

}
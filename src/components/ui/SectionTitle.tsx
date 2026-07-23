interface SectionTitleProps {
  title:string;
  subtitle?:string;
}

export default function SectionTitle({
title,
subtitle
}:SectionTitleProps){

return (

<div className="
mb-8
">

<h2 className="
text-3xl
md:text-4xl
font-bold
text-white
tracking-tight
">

{title}

</h2>


{
subtitle &&

<p className="
mt-3
text-zinc-400
text-lg
">

{subtitle}

</p>

}


<div className="
mt-4
h-1
w-16
rounded-full
bg-red-600
"/>


</div>

);

}
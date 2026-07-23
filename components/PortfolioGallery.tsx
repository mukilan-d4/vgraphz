"use client";

import { useState } from "react";


export default function PortfolioGallery({
  images
}:{
  images:string[]
}) {


  const [selected,setSelected] = useState<number | null>(null);



  function nextImage(){

    if(selected === null) return;

    setSelected(
      (selected + 1) % images.length
    );

  }



  function previousImage(){

    if(selected === null) return;

    setSelected(
      (selected - 1 + images.length) % images.length
    );

  }



  return (

    <>

      <div
      className="
      grid
      grid-cols-2
      gap-4
      md:grid-cols-3
      "
      >

        {
          images.map((img,index)=>(

            <img

            key={index}

            src={img}

            onClick={()=>setSelected(index)}

            className="
            h-48
            w-full
            cursor-pointer
            rounded-lg
            object-cover
            hover:opacity-80
            "

            />

          ))
        }


      </div>



      {
        selected !== null && (

          <div
          className="
          fixed
          inset-0
          z-50
          flex
          items-center
          justify-center
          bg-black/90
          p-5
          "
          >


            <button

            onClick={()=>setSelected(null)}

            className="
            absolute
            right-5
            top-5
            text-3xl
            text-white
            "

            >

              ✕

            </button>



            <button

            onClick={previousImage}

            className="
            absolute
            left-5
            text-5xl
            text-white
            "

            >

              ‹

            </button>



            <img

            src={images[selected]}

            className="
            max-h-[85vh]
            max-w-full
            rounded-lg
            object-contain
            "

            />



            <button

            onClick={nextImage}

            className="
            absolute
            right-5
            text-5xl
            text-white
            "

            >

              ›

            </button>


          </div>

        )
      }


    </>

  );

}
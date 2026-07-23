import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";


export async function POST(req: Request) {

  try {

    const { id } = await req.json();


    const { error } = await supabase
      .from("videographers")
      .update({
        approved: true,
        status: "approved"
      })
      .eq("id", id);


    if (error) {

      return NextResponse.json(
        {
          success:false,
          error:error.message
        },
        {
          status:500
        }
      );

    }


    return NextResponse.json({
      success:true
    });


  } catch(error:any){

    return NextResponse.json(
      {
        success:false,
        error:error.message
      },
      {
        status:500
      }
    );

  }

}
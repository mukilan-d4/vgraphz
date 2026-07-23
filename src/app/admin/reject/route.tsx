import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Provider ID is required"
        },
        {
          status: 400
        }
      );
    }

    const { error } = await supabase
      .from("videographers")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message
        },
        {
          status: 500
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Provider deleted successfully"
    });

  } catch(error) {
    console.error("Error in delete API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Server error"
      },
      {
        status: 500
      }
    );
  }
}
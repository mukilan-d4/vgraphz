import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: enquiries, error } = await supabase
      .from("enquiries")
      .select(`
        *,
        videographers(
          name,
          phone,
          category
        )
      `)
      .order("created_at", { ascending: false });

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
      data: enquiries
    });

  } catch (error) {
    console.error("Error fetching enquiries:", error);
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
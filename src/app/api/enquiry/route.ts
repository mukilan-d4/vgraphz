import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const provider_id = formData.get("provider_id");
    const customer_name = formData.get("customer_name");
    const customer_phone = formData.get("customer_phone");
    const event_type = formData.get("event_type");
    const message = formData.get("message");

    if (!provider_id || !customer_name || !customer_phone) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields"
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("enquiries")
      .insert({
        provider_id: parseInt(provider_id as string),
        name: customer_name as string,
        phone: customer_phone as string,
        event_type: event_type as string || null,
        requirements: message as string || null,
        status: "new"
      })
      .select();

    if (error) {
      console.error("Enquiry insert error:", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message
        },
        { status: 500 }
      );
    }

    return NextResponse.redirect(new URL("/thanks", request.url), {
      status: 303,
    });

  } catch (error) {
    console.error("Error in enquiry API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Server error"
      },
      { status: 500 }
    );
  }
}
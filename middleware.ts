import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export async function middleware(request: NextRequest) {


  const path = request.nextUrl.pathname;


  const supabaseCookie = Object.keys(
    request.cookies.getAll()
      .reduce((acc:any,cookie)=>{
        acc[cookie.name]=true;
        return acc;
      },{})
  )
  .find(name =>
    name.includes("auth-token")
  );



  if(
    path.startsWith("/admin") &&
    !supabaseCookie
  ){

    return NextResponse.redirect(
      new URL("/login",request.url)
    );

  }



  if(
    path.startsWith("/provider-dashboard") &&
    !supabaseCookie
  ){

    return NextResponse.redirect(
      new URL("/login",request.url)
    );

  }



  return NextResponse.next();


}



export const config = {

  matcher:[
    "/admin/:path*",
    "/provider-dashboard/:path*"
  ]

};
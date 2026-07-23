import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export async function middleware(request: NextRequest) {


const token = request.cookies.get(
"sb-access-token"
);



const path = request.nextUrl.pathname;



if(
path.startsWith("/admin") &&
!token
){

return NextResponse.redirect(
new URL("/login",request.url)
);

}



if(
path.startsWith("/provider-dashboard") &&
!token
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
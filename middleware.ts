import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(

    // ?NOTE : this middleware function will only be invoked if authorized callback returns true
    
    function middleware(){
        return NextResponse.next();
    },
    {
        callbacks : {
            authorized : ({token, req}) => {
                // console.log("Here is the req in middleware",req);
                const {pathname} = req.nextUrl;
                console.log("pathname in req", pathname)
                //allow auth related routes
                if(
                    pathname.startsWith("/api/auth") ||
                    pathname.includes(".svg") ||
                    pathname === "/login" ||
                    pathname === "/register"
                ){
                    return true;
                }

                //public routes
                if(
                    pathname === "/" || 
                    pathname === "/api/videos"
                ) {
                    return true;
                }

                //other routes will require token to access
                //if token is there then it will allow otherwise it will redirect to login page
                return !!token
            }
        }
    }
)
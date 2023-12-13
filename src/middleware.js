// import { NextResponse } from "next/server";

// export function middleware(request) {
//   const { pathname } = request.nextUrl;
//   const userData = request.cookies.get("userData")?.value;
//   const parseData = userData ? JSON.parse(userData) : userData;
//   const logout = ["logout", "signup"];
//   const userRoutes = ["/about", "/add-Task", "/posts", "/add-poll"];
//   let url = request.nextUrl.clone();
//   if (
//     parseData?._id !== undefined &&
//     request.nextUrl.pathname === "/login"
//   ) {
//     url.pathname = "/about";
//     return NextResponse.rewrite(url);
//   } else if (
//     parseData?._id === undefined &&
//     userRoutes.includes(pathname)
//   ) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }
// }

import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const userData = request.cookies.get("userData")?.value;
  const parseData = userData ? JSON.parse(userData) : userData;

  const logoutRoutes = ["/login", "/sign-up"];
  const userRoutes = ["/about", "/add-Task", "/posts", "/add-poll"];

  if (parseData?._id !== undefined && logoutRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/about", request.url));
  } else if (
    parseData?._id === undefined &&
    userRoutes.includes(pathname)
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/",
    "/about",
    "/add-Task",
    "/login",
    "/sign-up",
    "/posts",
    "/add-poll",
  ],
};

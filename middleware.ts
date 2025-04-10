import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const url = request.nextUrl;
  const pathname = url.pathname;

  const isAuthPage = pathname.startsWith("/auth");

  let isAuthenticated = false;
  if (token) {
    try {
      verifyToken(token);
      isAuthenticated = true;
    } catch (error) {
      isAuthenticated = false;
    }
  }

  if (!isAuthenticated && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo|.*\\..*|api).*)"],
};

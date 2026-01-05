import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/login", request.url), { status: 307 });
    }
  }

  if (pathname === "/login" || pathname === "/register") {
    if (refreshToken) {
      return NextResponse.redirect(new URL("/", request.url), { status: 307 });
    }
  }

  if (pathname.startsWith("/gallery")) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/login", request.url), { status: 307 });
    }
  }

  if (pathname.startsWith("/profile")) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/login", request.url), { status: 307 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/gallery", "/gallery/:path*", "/profile", "/login", "/register", ],
};

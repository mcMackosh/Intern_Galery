import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const { pathname } = request.nextUrl;

  // Захист кореневого маршруту
  if (pathname === "/") {
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/login", request.url), { status: 307 });
    }
  }

  // Якщо користувач намагається зайти на login/register і вже залогінений
  if (pathname === "/login" || pathname === "/register") {
    if (refreshToken) {
      return NextResponse.redirect(new URL("/", request.url), { status: 307 });
    }
  }

  // Middleware для всіх /gallery/* маршрутів
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
  matcher: ["/", "/gallery/:path*", "/profile", "/login", "/register", ],
};

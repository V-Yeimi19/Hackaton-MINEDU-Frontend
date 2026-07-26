import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { USER_COOKIE } from "@/lib/api/token";

export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has(USER_COOKIE);

  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

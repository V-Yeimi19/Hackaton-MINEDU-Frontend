import "server-only";
import type { NextResponse } from "next/server";
import { COOKIE_MAX_AGE, TOKEN_COOKIE, USER_COOKIE, type SessionUser } from "./token";

const cookieOptions = {
  httpOnly: false, // legible por JS: lo necesita el cliente WebSocket
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: COOKIE_MAX_AGE,
};

export function setSessionCookies(
  res: NextResponse,
  accessToken: string,
  user: SessionUser
): void {
  res.cookies.set(TOKEN_COOKIE, accessToken, cookieOptions);
  res.cookies.set(USER_COOKIE, JSON.stringify(user), cookieOptions);
}

export function clearSessionCookies(res: NextResponse): void {
  res.cookies.delete(TOKEN_COOKIE);
  res.cookies.delete(USER_COOKIE);
}

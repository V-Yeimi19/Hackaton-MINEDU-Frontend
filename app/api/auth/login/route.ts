import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/http";
import { loginDtoSchema } from "@/lib/api/schemas/auth";
import { login } from "@/lib/api/services/auth";
import { setSessionCookies } from "@/lib/api/session.server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginDtoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        statusCode: 400,
        message: parsed.error.issues.map((issue) => issue.message),
        error: "Bad Request",
      },
      { status: 400 }
    );
  }

  try {
    const { accessToken, user } = await login(parsed.data);
    const res = NextResponse.json({ user });
    setSessionCookies(res, accessToken, user);
    return res;
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { statusCode: err.statusCode, message: err.message, error: err.error },
        { status: err.statusCode }
      );
    }
    return NextResponse.json(
      { statusCode: 500, message: "Error inesperado", error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

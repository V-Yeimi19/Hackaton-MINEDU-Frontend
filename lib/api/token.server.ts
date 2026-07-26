import "server-only";
import { cookies } from "next/headers";
import { TOKEN_COOKIE, USER_COOKIE, type SessionUser } from "./token";

export async function getServerToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(TOKEN_COOKIE)?.value;
}

export async function getServerUser(): Promise<SessionUser | undefined> {
  const store = await cookies();
  const raw = store.get(USER_COOKIE)?.value;
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return undefined;
  }
}

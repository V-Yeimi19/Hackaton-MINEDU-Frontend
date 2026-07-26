export const TOKEN_COOKIE = "ad_token";
export const USER_COOKIE = "ad_user";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 días

export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  role: "ADMIN" | "DIRECTIVO" | "DOCENTE" | "FAMILIAR";
};

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

export function getClientToken(): string | undefined {
  return readCookie(TOKEN_COOKIE);
}

export function getClientUser(): SessionUser | undefined {
  const raw = readCookie(USER_COOKIE);
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return undefined;
  }
}

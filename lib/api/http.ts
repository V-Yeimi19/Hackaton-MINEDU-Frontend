import type { ZodType } from "zod";
import { GATEWAY_URL } from "./config";

export class ApiError extends Error {
  statusCode: number;
  error: string;

  constructor(statusCode: number, message: string, error: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.error = error;
  }
}

type ApiFetchOptions<T> = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  token?: string;
  schema?: ZodType<T>;
  query?: Record<string, string | number | boolean | undefined>;
  /** Para respuestas binarias (PDF/MP3) o redirects (302 a Storage). No se parsea como JSON. */
  raw?: boolean;
  signal?: AbortSignal;
};

function buildUrl(
  path: string,
  query?: Record<string, string | number | boolean | undefined>
): string {
  const url = new URL(path, GATEWAY_URL);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions<T> = {}
): Promise<T> {
  const { method = "GET", body, token, schema, query, raw, signal } = options;

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined && !isFormData) headers["Content-Type"] = "application/json";

  const res = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: body === undefined ? undefined : isFormData ? (body as FormData) : JSON.stringify(body),
    signal,
    cache: "no-store",
  });

  if (!res.ok) {
    let message = res.statusText;
    let error = res.statusText;
    try {
      const data = await res.json();
      message = Array.isArray(data.message) ? data.message.join(", ") : data.message ?? message;
      error = data.error ?? error;
    } catch {
      // el backend no devolvió JSON de error, se usa el statusText
    }
    throw new ApiError(res.status, message, error);
  }

  if (raw) return res as unknown as T;
  if (res.status === 204) return undefined as T;

  const data = await res.json();
  return schema ? schema.parse(data) : (data as T);
}

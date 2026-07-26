import { z } from "zod";

export const ROLES = ["ADMIN", "DIRECTIVO", "DOCENTE", "FAMILIAR"] as const;
export const roleSchema = z.enum(ROLES);

/**
 * Confirmado contra el backend (users/analytics/storage/notifications
 * findAll/find* paginados): el envelope real es `{ items, total, page, limit }`,
 * no `{ data, ... }`.
 */
export function paginated<T extends z.ZodTypeAny>(item: T) {
  return z.object({
    items: z.array(item),
    items: z.array(item),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
  });
}
export type Paginated<T> = { items: T[]; total: number; page: number; limit: number };
export type Paginated<T> = { items: T[]; total: number; page: number; limit: number };

/**
 * Ningún endpoint DELETE del backend devuelve `{ deleted: true }` — todos
 * responden 200 con body vacío (ver fix en lib/api/http.ts). apiFetch ya
 * devuelve `undefined` en ese caso sin llegar a llamar `schema.parse`; este
 * schema solo existe para que el tipo de retorno no mienta diciendo
 * `{ deleted: true }` cuando en realidad es `undefined`.
 */
export const deletedResponseSchema = z.void();

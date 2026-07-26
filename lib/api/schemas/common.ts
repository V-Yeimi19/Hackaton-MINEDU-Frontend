import { z } from "zod";

export const ROLES = ["ADMIN", "DIRECTIVO", "DOCENTE", "FAMILIAR"] as const;
export const roleSchema = z.enum(ROLES);

/**
 * docs/API.md no especifica el envelope exacto de las respuestas paginadas
 * (solo documenta los query params `page`/`limit`). Se asume el patrón
 * estándar de NestJS `{ data, total, page, limit }`; si el backend real
 * devuelve otra forma, ajustar solo este helper.
 */
export function paginated<T extends z.ZodTypeAny>(item: T) {
  return z.object({
    data: z.array(item),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
  });
}
export type Paginated<T> = { data: T[]; total: number; page: number; limit: number };

export const deletedResponseSchema = z.object({ deleted: z.literal(true) });

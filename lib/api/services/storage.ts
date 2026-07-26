import { apiFetch } from "../http";
import { deletedResponseSchema, paginated } from "../schemas/common";
import { fileSchema } from "../schemas/storage";

export function uploadFile(file: File, token: string) {
  const formData = new FormData();
  formData.append("file", file);
  return apiFetch("/api/storage/upload", {
    method: "POST",
    body: formData,
    token,
    schema: fileSchema,
  });
}

export function listFiles(token: string, query?: { page?: number; limit?: number }) {
  return apiFetch("/api/storage", { token, query, schema: paginated(fileSchema) });
}

export function getFile(id: string, token: string) {
  return apiFetch(`/api/storage/${id}`, { token, schema: fileSchema });
}

/**
 * GET /api/storage/:id/download responde con un 302 a una URL prefirmada de
 * MinIO. docs/SERVICES.md advierte que esa URL usa el hostname interno de
 * Docker (`minio:9000`), que no resuelve desde el navegador — es un bug de
 * backend, no algo que se pueda arreglar desde el frontend. Se deja como
 * navegación directa (nueva pestaña) tal como recomienda docs/API.md; si el
 * bug persiste, la descarga fallará hasta que el backend firme URLs con un
 * hostname público.
 */
export function downloadFileUrl(id: string): string {
  return `/api/storage/${id}/download`;
}

export function deleteFile(id: string, token: string) {
  return apiFetch(`/api/storage/${id}`, {
    method: "DELETE",
    token,
    schema: deletedResponseSchema,
  });
}

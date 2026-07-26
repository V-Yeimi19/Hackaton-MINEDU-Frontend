import { apiFetch } from "../http";
import { deletedResponseSchema, paginated } from "../schemas/common";
import { userSchema, type UpdateUserDto } from "../schemas/users";

export function listUsers(
  token: string,
  query?: { role?: string; page?: number; limit?: number }
) {
  return apiFetch("/api/users", {
    token,
    query,
    schema: paginated(userSchema),
  });
}

export function getUser(id: string, token: string) {
  return apiFetch(`/api/users/${id}`, { token, schema: userSchema });
}

/** El JWT solo trae el id de AuthUser, no el id (propio) del perfil en Users — este endpoint resuelve por el token, sin necesitar ese id. */
export function getMe(token: string) {
  return apiFetch(`/api/users/me`, { token, schema: userSchema });
}

export function updateUser(id: string, dto: UpdateUserDto, token: string) {
  return apiFetch(`/api/users/${id}`, {
    method: "PATCH",
    body: dto,
    token,
    schema: userSchema,
  });
}

export function deleteUser(id: string, token: string) {
  return apiFetch(`/api/users/${id}`, {
    method: "DELETE",
    token,
    schema: deletedResponseSchema,
  });
}

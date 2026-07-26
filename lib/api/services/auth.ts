import { apiFetch } from "../http";
import {
  authResponseSchema,
  authUserSchema,
  type ChangeRoleDto,
  type LoginDto,
  type RegisterDto,
} from "../schemas/auth";

export function register(dto: RegisterDto) {
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: dto,
    schema: authResponseSchema,
  });
}

export function login(dto: LoginDto) {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: dto,
    schema: authResponseSchema,
  });
}

export function changeRole(authUserId: string, dto: ChangeRoleDto, token: string) {
  return apiFetch(`/api/auth/${authUserId}/role`, {
    method: "PATCH",
    body: dto,
    token,
    schema: authUserSchema,
  });
}

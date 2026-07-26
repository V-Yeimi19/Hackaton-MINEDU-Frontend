"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button, FieldError, Select } from "@/components/ui/form";
import { GlassCard } from "@/components/ui/glass-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeaderRow,
  TableRow,
} from "@/components/ui/table";
import { authApi, usersApi } from "@/lib/api";
import { getClientToken } from "@/lib/api/token";
import { ROLES } from "@/lib/api/schemas/common";
import type { User } from "@/lib/api/schemas/users";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrador",
  DIRECTIVO: "Directivo",
  DOCENTE: "Docente",
  FAMILIAR: "Familiar",
};

const ROLE_OPTIONS = ROLES.map((r) => ({ value: r, label: ROLE_LABELS[r] ?? r }));

const LIMIT = 10;

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const fetchUsers = useCallback(async () => {
    const token = getClientToken();
    if (!token) return;

    setLoading(true);
    setError(undefined);
    try {
      const res = await usersApi.listUsers(token, {
        role: roleFilter || undefined,
        page,
        limit: LIMIT,
      });
      setUsers(res.items);
      setTotal(res.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los usuarios");
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  async function handleRoleChange(userId: string, authUserId: string, newRole: string) {
    const token = getClientToken();
    if (!token) return;

    try {
      await authApi.changeRole(authUserId, { role: newRole as User["role"] }, token);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole as User["role"] } : u))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cambiar el rol");
    }
  }

  async function handleDelete(userId: string) {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.")) return;

    const token = getClientToken();
    if (!token) return;

    try {
      await usersApi.deleteUser(userId, token);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setTotal((prev) => prev - 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el usuario");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-headline-md text-on-surface">Gestión de usuarios</h1>

      <GlassCard>
        <div className="flex items-center gap-4">
          <label className="text-label-md uppercase tracking-wide text-on-surface-variant">
            Filtrar por rol
          </label>
          <Select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="w-auto"
          >
            <option value="">Todos</option>
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
      </GlassCard>

      <FieldError message={error} />

      <GlassCard>
        {loading ? (
          <p className="text-body-md text-on-surface-variant">Cargando usuarios...</p>
        ) : users.length === 0 ? (
          <p className="text-body-md text-on-surface-variant">No se encontraron usuarios.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableHeaderRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell className="text-on-surface-variant">{user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user.id, user.authUserId, e.target.value)
                      }
                      className="w-auto"
                    >
                      {ROLE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell className="text-on-surface-variant">
                    {new Date(user.createdAt).toLocaleDateString("es-PE")}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="secondary"
                      onClick={() => handleDelete(user.id)}
                      className="text-error"
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-body-md text-on-surface-variant">
              Página {page} de {totalPages} ({total} usuarios)
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Anterior
              </Button>
              <Button
                variant="secondary"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}

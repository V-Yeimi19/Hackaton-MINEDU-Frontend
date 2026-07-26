"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, FieldError, Input, Label } from "@/components/ui/form";
import { usersApi } from "@/lib/api";
import { getClientToken } from "@/lib/api/token";
import type { User } from "@/lib/api/schemas/users";

export function EditProfileForm({ user }: { user: User }) {
  const router = useRouter();
  const [fullName, setFullName] = useState(user.fullName);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);
    setSuccess(false);
    const token = getClientToken();
    if (!token) return;

    setSubmitting(true);
    try {
      await usersApi.updateUser(user.id, { fullName }, token);
      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar el perfil");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="fullName">Nombre completo</Label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>
      <FieldError message={error} />
      {success && <p className="text-label-md text-primary">Perfil actualizado.</p>}
      <Button type="submit" disabled={submitting} className="self-start">
        {submitting ? "Guardando..." : "Guardar cambios"}
      </Button>
    </form>
  );
}

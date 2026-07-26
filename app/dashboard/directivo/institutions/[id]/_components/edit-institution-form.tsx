"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, FieldError, Input } from "@/components/ui/form";
import { classroomApi } from "@/lib/api";
import { getClientToken } from "@/lib/api/token";

export function EditInstitutionForm({
  institutionId,
  initialName,
  initialCode,
  initialAddress,
}: {
  institutionId: string;
  initialName: string;
  initialCode: string;
  initialAddress: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [code, setCode] = useState(initialCode);
  const [address, setAddress] = useState(initialAddress);
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
      await classroomApi.institutions.update(
        institutionId,
        { name, code: code || undefined, address: address || undefined },
        token
      );
      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar la institución");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <label className="text-label-md uppercase tracking-wide text-on-surface-variant">
          Nombre
        </label>
        <Input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label className="text-label-md uppercase tracking-wide text-on-surface-variant">
          Código
        </label>
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>
      <div>
        <label className="text-label-md uppercase tracking-wide text-on-surface-variant">
          Dirección
        </label>
        <Input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <FieldError message={error} />
      {success && <p className="text-label-md text-green-500">Institución actualizada correctamente.</p>}
      <div>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </form>
  );
}

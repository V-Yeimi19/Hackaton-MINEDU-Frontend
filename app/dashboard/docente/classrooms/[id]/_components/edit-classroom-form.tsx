"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, FieldError, Input } from "@/components/ui/form";
import { classroomApi } from "@/lib/api";
import { getClientToken } from "@/lib/api/token";

export function EditClassroomForm({
  classroomId,
  initialName,
  initialGradeLevel,
}: {
  classroomId: string;
  initialName: string;
  initialGradeLevel: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [gradeLevel, setGradeLevel] = useState(initialGradeLevel);
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
      await classroomApi.classrooms.update(classroomId, { name, gradeLevel }, token);
      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar el aula");
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
          Nivel
        </label>
        <Input
          required
          value={gradeLevel}
          onChange={(e) => setGradeLevel(e.target.value)}
        />
      </div>
      <FieldError message={error} />
      {success && <p className="text-label-md text-green-500">Aula actualizada correctamente.</p>}
      <div>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </form>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, FieldError, Input } from "@/components/ui/form";
import { classroomApi } from "@/lib/api";
import { getClientToken } from "@/lib/api/token";

export function CreateCourseForm({ classroomId }: { classroomId: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);
    const token = getClientToken();
    if (!token) return;

    setSubmitting(true);
    try {
      await classroomApi.courses.create({ name, classroomId }, token);
      setName("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el curso");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <div className="flex-1">
        <Input
          placeholder="Nombre del curso (ej. Matemática)"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <FieldError message={error} />
      </div>
      <Button type="submit" disabled={submitting}>
        {submitting ? "Agregando..." : "Agregar curso"}
      </Button>
    </form>
  );
}

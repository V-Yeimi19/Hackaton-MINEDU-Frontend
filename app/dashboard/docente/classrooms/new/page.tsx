"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button, FieldError, Input, Label } from "@/components/ui/form";
import { classroomApi } from "@/lib/api";
import { getClientToken } from "@/lib/api/token";

export default function NewClassroomPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);
    const token = getClientToken();
    if (!token) {
      setError("Sesión expirada, vuelve a iniciar sesión.");
      return;
    }

    setSubmitting(true);
    try {
      const classroom = await classroomApi.classrooms.create({ name, gradeLevel }, token);
      router.push(`/dashboard/docente/classrooms/${classroom.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el aula");
      setSubmitting(false);
    }
  }

  return (
    <GlassCard className="max-w-lg">
      <h1 className="text-headline-md text-on-surface">Crear aula</h1>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Grado</Label>
          <Input
            id="name"
            required
            placeholder="1ro Primaria"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="gradeLevel">Sección</Label>
          <Input
            id="gradeLevel"
            required
            placeholder="A"
            value={gradeLevel}
            onChange={(e) => setGradeLevel(e.target.value)}
          />
        </div>
        <FieldError message={error} />
        <Button type="submit" disabled={submitting} className="mt-2">
          {submitting ? "Creando..." : "Crear aula"}
        </Button>
      </form>
    </GlassCard>
  );
}

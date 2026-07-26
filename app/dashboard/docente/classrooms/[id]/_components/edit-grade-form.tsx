"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, FieldError, Input } from "@/components/ui/form";
import { classroomApi } from "@/lib/api";
import { getClientToken } from "@/lib/api/token";
import type { Grade } from "@/lib/api/schemas/classroom";

export function EditGradeForm({ grade }: { grade: Grade }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [evaluation, setEvaluation] = useState(grade.evaluation);
  const [score, setScore] = useState(String(grade.score));
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);
    const token = getClientToken();
    if (!token) return;

    setSubmitting(true);
    try {
      await classroomApi.grades.update(
        grade.id,
        { evaluation, score: Number(score) },
        token
      );
      setEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar la nota");
    } finally {
      setSubmitting(false);
    }
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="text-body-md text-on-surface-variant hover:text-primary transition-colors"
      >
        Editar
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <Input
        placeholder="Evaluación"
        required
        value={evaluation}
        onChange={(e) => setEvaluation(e.target.value)}
        className="w-32"
      />
      <Input
        type="number"
        min={0}
        max={20}
        step={0.5}
        placeholder="Nota"
        required
        value={score}
        onChange={(e) => setScore(e.target.value)}
        className="w-20"
      />
      <Button type="submit" disabled={submitting} className="px-3 py-1.5 text-label-md">
        {submitting ? "..." : "✓"}
      </Button>
      <Button
        type="button"
        variant="secondary"
        onClick={() => {
          setEvaluation(grade.evaluation);
          setScore(String(grade.score));
          setEditing(false);
          setError(undefined);
        }}
        className="px-3 py-1.5 text-label-md"
      >
        Cancelar
      </Button>
      <FieldError message={error} />
    </form>
  );
}

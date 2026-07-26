"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, FieldError, Input } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { dashboardApi } from "@/lib/api";
import { getClientToken } from "@/lib/api/token";
import type { CourseProgress } from "@/lib/api/schemas/dashboard";

export function CourseProgressForm({
  courseId,
  courseName,
  initialProgress,
}: {
  courseId: string;
  courseName: string;
  initialProgress: CourseProgress;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [totalUnits, setTotalUnits] = useState(String(initialProgress.totalUnits));
  const [completedUnits, setCompletedUnits] = useState(String(initialProgress.completedUnits));
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  async function handleSave() {
    setError(undefined);
    const token = getClientToken();
    if (!token) return;

    setSubmitting(true);
    try {
      await dashboardApi.progress.updateCourse(
        courseId,
        { totalUnits: Number(totalUnits), completedUnits: Number(completedUnits) },
        token
      );
      setEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar el avance");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-md border border-outline-variant p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-body-md text-on-surface">{courseName}</span>
        <Badge tone={initialProgress.percentage >= 100 ? "primary" : "neutral"}>
          {initialProgress.percentage}%
        </Badge>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container">
        <div
          className="h-full rounded-full bg-primary-container"
          style={{ width: `${Math.min(100, initialProgress.percentage)}%` }}
        />
      </div>

      {editing ? (
        <div className="mt-1 flex flex-wrap items-end gap-2">
          <div>
            <label className="text-label-md text-on-surface-variant">Unidades totales</label>
            <Input
              type="number"
              min={0}
              value={totalUnits}
              onChange={(e) => setTotalUnits(e.target.value)}
              className="w-28"
            />
          </div>
          <div>
            <label className="text-label-md text-on-surface-variant">Completadas</label>
            <Input
              type="number"
              min={0}
              value={completedUnits}
              onChange={(e) => setCompletedUnits(e.target.value)}
              className="w-28"
            />
          </div>
          <Button onClick={handleSave} disabled={submitting} className="px-4 py-2">
            {submitting ? "Guardando..." : "Guardar"}
          </Button>
          <Button
            variant="secondary"
            className="px-4 py-2"
            onClick={() => {
              setEditing(false);
              setTotalUnits(String(initialProgress.totalUnits));
              setCompletedUnits(String(initialProgress.completedUnits));
              setError(undefined);
            }}
          >
            Cancelar
          </Button>
          <FieldError message={error} />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="w-fit text-label-md text-primary hover:underline"
        >
          Actualizar avance
        </button>
      )}
    </div>
  );
}

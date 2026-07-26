"use client";

import { useState } from "react";
import { Button, FieldError, Select } from "@/components/ui/form";
import { classroomApi } from "@/lib/api";
import { getClientToken } from "@/lib/api/token";
import type { Competency, Course, EnrollmentWithStudent } from "@/lib/api/schemas/classroom";

const LEVEL_OPTIONS = ["BASICO", "INTERMEDIO", "AVANZADO", "LOGRADO"] as const;

export function EvaluateCompetencyForm({
  roster,
  courses,
  competencies,
}: {
  classroomId: string;
  roster: EnrollmentWithStudent[];
  courses: Course[];
  competencies: Competency[];
}) {
  const [studentId, setStudentId] = useState(roster[0]?.studentId ?? "");
  const [courseId, setCourseId] = useState(courses[0]?.id ?? "");
  const [competencyId, setCompetencyId] = useState(competencies[0]?.id ?? "");
  const [level, setLevel] = useState<string>("INTERMEDIO");
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
      await classroomApi.competencies.evaluate(
        { studentId, courseId, competencyId, level: level as "BASICO" | "INTERMEDIO" | "AVANZADO" | "LOGRADO" },
        token
      );
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo evaluar la competencia");
    } finally {
      setSubmitting(false);
    }
  }

  if (competencies.length === 0) {
    return (
      <p className="text-body-md text-on-surface-variant">
        Primero crea una competencia para poder evaluar.
      </p>
    );
  }

  if (roster.length === 0 || courses.length === 0) {
    return (
      <p className="text-body-md text-on-surface-variant">
        Necesitas al menos un curso y un estudiante matriculado.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <Select value={studentId} onChange={(e) => setStudentId(e.target.value)}>
        {roster.map((r) => (
          <option key={r.studentId} value={r.studentId}>
            {r.student.fullName}
          </option>
        ))}
      </Select>
      <Select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
        {courses.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>
      <Select value={competencyId} onChange={(e) => setCompetencyId(e.target.value)}>
        {competencies.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name} ({c.area})
          </option>
        ))}
      </Select>
      <Select value={level} onChange={(e) => setLevel(e.target.value)}>
        {LEVEL_OPTIONS.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </Select>
      <div>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Evaluando..." : "Evaluar"}
        </Button>
      </div>
      <FieldError message={error} />
      {success && <p className="text-label-md text-primary">Evaluación registrada.</p>}
    </form>
  );
}

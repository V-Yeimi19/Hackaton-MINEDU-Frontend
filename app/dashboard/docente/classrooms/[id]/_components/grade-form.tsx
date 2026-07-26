"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, FieldError, Input, Select } from "@/components/ui/form";
import { classroomApi } from "@/lib/api";
import { getClientToken } from "@/lib/api/token";
import type { Course, EnrollmentWithStudent } from "@/lib/api/schemas/classroom";

export function GradeForm({
  roster,
  courses,
}: {
  classroomId: string;
  roster: EnrollmentWithStudent[];
  courses: Course[];
}) {
  const router = useRouter();
  const [studentId, setStudentId] = useState(roster[0]?.studentId ?? "");
  const [courseId, setCourseId] = useState(courses[0]?.id ?? "");
  const [evaluation, setEvaluation] = useState("");
  const [score, setScore] = useState("");
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  // roster/courses pueden pasar de vacíos a tener datos sin que este
  // componente se remonte (mismo GradeForm, nuevas props tras un
  // router.refresh()) — el useState inicial no vuelve a evaluarse, así que
  // sin este efecto el select queda con un id "" que ya no existe en la
  // lista, y el submit manda un courseId/studentId vacío (400 "must be a UUID").
  useEffect(() => {
    if (roster.length > 0 && !roster.some((r) => r.studentId === studentId)) {
      setStudentId(roster[0].studentId);
    }
  }, [roster, studentId]);

  useEffect(() => {
    if (courses.length > 0 && !courses.some((c) => c.id === courseId)) {
      setCourseId(courses[0].id);
    }
  }, [courses, courseId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);
    const token = getClientToken();
    if (!token) return;

    setSubmitting(true);
    try {
      await classroomApi.grades.create(
        { studentId, courseId, evaluation, score: Number(score) },
        token
      );
      setEvaluation("");
      setScore("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar la nota");
    } finally {
      setSubmitting(false);
    }
  }

  if (roster.length === 0 || courses.length === 0) {
    return (
      <p className="text-body-md text-on-surface-variant">
        Necesitas al menos un curso y un estudiante matriculado para registrar notas.
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
      <Input
        placeholder="Evaluación"
        required
        value={evaluation}
        onChange={(e) => setEvaluation(e.target.value)}
      />
      <Input
        type="number"
        min={0}
        max={20}
        step={0.5}
        placeholder="Nota (0-20)"
        required
        value={score}
        onChange={(e) => setScore(e.target.value)}
        className="sm:w-28"
      />
      <div>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Guardando..." : "Registrar nota"}
        </Button>
        <FieldError message={error} />
      </div>
    </form>
  );
}

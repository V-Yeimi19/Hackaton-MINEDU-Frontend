"use client";

import { useState } from "react";
import { Button, FieldError, Select } from "@/components/ui/form";
import { classroomApi } from "@/lib/api";
import { getClientToken } from "@/lib/api/token";
import type { AttendanceStatus } from "@/lib/api/schemas/classroom";
import type { EnrollmentWithStudent } from "@/lib/api/schemas/classroom";

const STATUS_OPTIONS: AttendanceStatus[] = ["PRESENT", "ABSENT", "LATE", "EXCUSED"];

export function AttendanceForm({
  classroomId,
  roster,
}: {
  classroomId: string;
  roster: EnrollmentWithStudent[];
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>(
    Object.fromEntries(roster.map((r) => [r.studentId, "PRESENT" as AttendanceStatus]))
  );
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
      await classroomApi.attendance.create(
        {
          classroomId,
          date: today,
          records: roster.map((r) => ({
            studentId: r.studentId,
            status: statuses[r.studentId],
          })),
        },
        token
      );
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar la asistencia");
    } finally {
      setSubmitting(false);
    }
  }

  if (roster.length === 0) {
    return (
      <p className="text-body-md text-on-surface-variant">
        Aún no hay estudiantes matriculados en esta aula.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <p className="text-label-md text-on-surface-variant">Fecha: {today}</p>
      <ul className="flex flex-col gap-2">
        {roster.map((r) => (
          <li key={r.studentId} className="flex items-center justify-between gap-4">
            <span className="text-body-md text-on-surface">{r.student.fullName}</span>
            <Select
              className="w-40"
              value={statuses[r.studentId]}
              onChange={(e) =>
                setStatuses((prev) => ({
                  ...prev,
                  [r.studentId]: e.target.value as AttendanceStatus,
                }))
              }
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
          </li>
        ))}
      </ul>
      <FieldError message={error} />
      {success && <p className="text-label-md text-primary">Asistencia registrada.</p>}
      <Button type="submit" disabled={submitting} className="self-start">
        {submitting ? "Guardando..." : "Guardar asistencia"}
      </Button>
    </form>
  );
}

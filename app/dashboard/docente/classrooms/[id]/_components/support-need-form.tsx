"use client";

import { useEffect, useState } from "react";
import { Button, FieldError, Input, Select } from "@/components/ui/form";
import { classroomApi } from "@/lib/api";
import { getClientToken } from "@/lib/api/token";
import type { EnrollmentWithStudent, SupportNeedType, SupportLevel } from "@/lib/api/schemas/classroom";

const SUPPORT_TYPES: SupportNeedType[] = [
  "DISCAPACIDAD_VISUAL",
  "DISCAPACIDAD_AUDITIVA",
  "DISCAPACIDAD_INTELECTUAL",
  "DISCAPACIDAD_MOTORA",
  "TRASTORNO_ESPECTRO_AUTISTA",
  "DIFICULTAD_APRENDIZAJE",
  "TDAH",
  "MULTIDISCAPACIDAD",
  "OTRO",
];

const SUPPORT_LEVELS: SupportLevel[] = ["LEVE", "MODERADO", "SIGNIFICATIVO"];

const SUPPORT_LABELS: Record<SupportNeedType, string> = {
  DISCAPACIDAD_VISUAL: "Discapacidad visual",
  DISCAPACIDAD_AUDITIVA: "Discapacidad auditiva",
  DISCAPACIDAD_INTELECTUAL: "Discapacidad intelectual",
  DISCAPACIDAD_MOTORA: "Discapacidad motora",
  TRASTORNO_ESPECTRO_AUTISTA: "TEA",
  DIFICULTAD_APRENDIZAJE: "Dificultad de aprendizaje",
  TDAH: "TDAH",
  MULTIDISCAPACIDAD: "Multidiscapacidad",
  OTRO: "Otro",
};

export function SupportNeedForm({
  roster,
}: {
  classroomId: string;
  roster: EnrollmentWithStudent[];
}) {
  const [studentId, setStudentId] = useState(roster[0]?.studentId ?? "");
  const [type, setType] = useState<SupportNeedType>("TDAH");

  // Ver el mismo comentario en grade-form.tsx: sin esto, un studentId vacío
  // sobrevive a un router.refresh() que recién trae al primer estudiante matriculado.
  useEffect(() => {
    if (roster.length > 0 && !roster.some((r) => r.studentId === studentId)) {
      setStudentId(roster[0].studentId);
    }
  }, [roster, studentId]);

  const [level, setLevel] = useState<SupportLevel>("MODERADO");
  const [description, setDescription] = useState("");
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
      await classroomApi.supportNeeds.create(
        { studentId, type, level, description: description || undefined },
        token
      );
      setDescription("");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar la necesidad de apoyo");
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <Select value={studentId} onChange={(e) => setStudentId(e.target.value)}>
          {roster.map((r) => (
            <option key={r.studentId} value={r.studentId}>
              {r.student.fullName}
            </option>
          ))}
        </Select>
        <Select
          value={type}
          onChange={(e) => setType(e.target.value as SupportNeedType)}
        >
          {SUPPORT_TYPES.map((t) => (
            <option key={t} value={t}>
              {SUPPORT_LABELS[t]}
            </option>
          ))}
        </Select>
        <Select
          value={level}
          onChange={(e) => setLevel(e.target.value as SupportLevel)}
        >
          {SUPPORT_LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </Select>
      </div>
      <Input
        placeholder="Descripción (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Registrando..." : "Registrar necesidad"}
        </Button>
        <FieldError message={error} />
        {success && <p className="text-label-md text-primary">Necesidad registrada.</p>}
      </div>
    </form>
  );
}

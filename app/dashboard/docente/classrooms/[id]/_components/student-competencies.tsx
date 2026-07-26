"use client";

import { useEffect, useState } from "react";
import { classroomApi } from "@/lib/api";
import { getClientToken } from "@/lib/api/token";
import { Badge } from "@/components/ui/badge";
import type { StudentCompetency } from "@/lib/api/schemas/classroom";

const LEVEL_TONE: Record<string, "primary" | "error" | "tertiary" | "neutral"> = {
  BASICO: "error",
  INTERMEDIO: "neutral",
  AVANZADO: "primary",
  LOGRADO: "tertiary",
};

export function StudentCompetencies({
  studentId,
  studentName,
}: {
  studentId: string;
  studentName: string;
}) {
  const [open, setOpen] = useState(false);
  const [competencies, setCompetencies] = useState<StudentCompetency[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || competencies.length > 0) return;
    const token = getClientToken();
    if (!token) return;
    setLoading(true);
    classroomApi.competencies
      .byStudent(studentId, token)
      .then(setCompetencies)
      .finally(() => setLoading(false));
  }, [open, studentId, competencies.length]);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="text-body-md font-medium text-on-surface hover:text-primary transition-colors"
      >
        {studentName} {open ? "▴" : "▾"}
      </button>
      {open && (
        <div className="mt-2 flex flex-col gap-1.5 pl-4">
          {loading && (
            <p className="text-body-md text-on-surface-variant">Cargando...</p>
          )}
          {!loading && competencies.length === 0 && (
            <p className="text-body-md text-on-surface-variant">
              Sin competencias registradas.
            </p>
          )}
          {competencies.map((sc) => (
            <div
              key={sc.id}
              className="flex items-center justify-between text-body-md"
            >
              <span className="text-on-surface-variant">
                {sc.competency.name} ({sc.competency.area})
              </span>
              <Badge tone={LEVEL_TONE[sc.level] ?? "neutral"}>{sc.level}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

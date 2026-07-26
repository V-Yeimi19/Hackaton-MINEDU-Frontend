"use client";

import { useState } from "react";
import { Button, FieldError, Input } from "@/components/ui/form";
import { reportsApi } from "@/lib/api";
import { getClientToken } from "@/lib/api/token";

export function GenerateStudentReportButton({
  studentId,
  classroomId,
}: {
  studentId: string;
  classroomId: string;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);

  const [open, setOpen] = useState(false);
  const [periodStart, setPeriodStart] = useState(thirtyDaysAgo);
  const [periodEnd, setPeriodEnd] = useState(today);
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  async function handleGenerate() {
    setError(undefined);
    const token = getClientToken();
    if (!token) return;

    setSubmitting(true);
    try {
      const res = await reportsApi.generateStudentReportPdf(
        { studentId, classroomId, periodStart, periodEnd },
        token
      );
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reporte-estudiante-${studentId}-${periodStart}-${periodEnd}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo generar el reporte");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative">
      <Button
        variant="secondary"
        className="px-3 py-1.5 text-label-md"
        onClick={() => setOpen((prev) => !prev)}
      >
        Reporte PDF
      </Button>

      {open && (
        <div className="absolute right-0 top-full z-10 mt-2 w-72 rounded-lg border border-outline-variant bg-surface-container-lowest p-4 shadow-lg">
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-label-md text-on-surface-variant mb-1">Desde</p>
              <Input
                type="date"
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
              />
            </div>
            <div>
              <p className="text-label-md text-on-surface-variant mb-1">Hasta</p>
              <Input
                type="date"
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setOpen(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleGenerate} disabled={submitting} className="flex-1">
                {submitting ? "Generando..." : "Descargar"}
              </Button>
            </div>
            <FieldError message={error} />
          </div>
        </div>
      )}
    </div>
  );
}

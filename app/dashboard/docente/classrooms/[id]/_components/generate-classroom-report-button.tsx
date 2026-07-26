"use client";

import { useState } from "react";
import { Button, FieldError, Input } from "@/components/ui/form";
import { reportsApi } from "@/lib/api";
import { getClientToken } from "@/lib/api/token";

export function GenerateClassroomReportButton({ classroomId }: { classroomId: string }) {
  const today = new Date().toISOString().slice(0, 10);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);

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
      const res = await reportsApi.generateClassroomReportPdf(
        { classroomId, periodStart, periodEnd },
        token
      );
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reporte-aula-${periodStart}-${periodEnd}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo generar el reporte");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
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
        <Button onClick={handleGenerate} disabled={submitting}>
          {submitting ? "Generando..." : "Descargar PDF"}
        </Button>
      </div>
      <FieldError message={error} />
    </div>
  );
}

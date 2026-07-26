"use client";

import { useState } from "react";
import { Button, FieldError, Input } from "@/components/ui/form";
import { GlassCard } from "@/components/ui/glass-card";
import { aiApi } from "@/lib/api";
import { getClientToken } from "@/lib/api/token";
import type { GenerateAiReportResponse } from "@/lib/api/schemas/ai";

export function GenerateAiReportForm({ classroomId }: { classroomId: string }) {
  const today = new Date().toISOString().slice(0, 10);
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);

  const [weekStart, setWeekStart] = useState(sevenDaysAgo);
  const [weekEnd, setWeekEnd] = useState(today);
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<GenerateAiReportResponse | null>(null);

  async function handleGenerate() {
    setError(undefined);
    setResult(null);
    const token = getClientToken();
    if (!token) return;

    setSubmitting(true);
    try {
      const res = await aiApi.generateWeeklyReport(
        { classroomId, weekStart, weekEnd },
        token
      );
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo generar el reporte");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDownloadPdf() {
    setError(undefined);
    const token = getClientToken();
    if (!token) return;

    setSubmitting(true);
    try {
      const res = await aiApi.generateWeeklyReportPdf(
        { classroomId, weekStart, weekEnd },
        token
      );
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reporte-semanal-ia-${weekStart}-${weekEnd}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo descargar el PDF");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-label-md text-on-surface-variant mb-1">Semana desde</p>
          <Input
            type="date"
            value={weekStart}
            onChange={(e) => setWeekStart(e.target.value)}
          />
        </div>
        <div>
          <p className="text-label-md text-on-surface-variant mb-1">Hasta</p>
          <Input
            type="date"
            value={weekEnd}
            onChange={(e) => setWeekEnd(e.target.value)}
          />
        </div>
        <Button onClick={handleGenerate} disabled={submitting}>
          {submitting ? "Analizando..." : "Generar reporte IA"}
        </Button>
        {result && (
          <Button variant="secondary" onClick={handleDownloadPdf} disabled={submitting}>
            Descargar PDF
          </Button>
        )}
      </div>
      <FieldError message={error} />

      {result && (
        <>
          <GlassCard>
            <h3 className="text-label-md uppercase tracking-wide text-on-surface-variant">
              Resumen de asistencia
            </h3>
            <div className="mt-2 flex gap-4">
              {Object.entries(result.attendanceSummary).map(([key, value]) => (
                <div key={key}>
                  <p className="text-body-lg font-medium text-on-surface">{String(value)}</p>
                  <p className="text-label-md text-on-surface-variant">{key}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-label-md uppercase tracking-wide text-on-surface-variant">
              Resumen de notas
            </h3>
            <div className="mt-2 flex gap-4">
              {Object.entries(result.gradeSummary).map(([key, value]) => (
                <div key={key}>
                  <p className="text-body-lg font-medium text-on-surface">{String(value)}</p>
                  <p className="text-label-md text-on-surface-variant">{key}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          {result.anomalies.length > 0 && (
            <GlassCard>
              <h3 className="text-label-md uppercase tracking-wide text-tertiary">
                Anomalías detectadas
              </h3>
              <ul className="mt-2 list-inside list-disc">
                {result.anomalies.map((a, i) => (
                  <li key={i} className="text-body-md text-on-surface">
                    {a.message}
                  </li>
                ))}
              </ul>
            </GlassCard>
          )}
        </>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button, FieldError, Input } from "@/components/ui/form";
import { reportsApi } from "@/lib/api";
import { getClientToken } from "@/lib/api/token";

export function GenerateInstitutionalReportButton() {
  const today = new Date().toISOString().slice(0, 10);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);

  const [periodStart, setPeriodStart] = useState(thirtyDaysAgo);
  const [periodEnd, setPeriodEnd] = useState(today);
  const [gradeLevel, setGradeLevel] = useState("");
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<{ csvFileId: string; pdfFileId: string }>();
  const [submitting, setSubmitting] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  function buildDto() {
    return {
      periodStart,
      periodEnd,
      ...(gradeLevel.trim() ? { gradeLevel: gradeLevel.trim() } : {}),
    };
  }

  async function handleGenerate() {
    setError(undefined);
    setSuccess(undefined);
    const token = getClientToken();
    if (!token) return;

    setSubmitting(true);
    try {
      const res = await reportsApi.generateInstitutionalReport(buildDto(), token);
      setSuccess({ csvFileId: res.csvFileId, pdfFileId: res.pdfFileId });
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

    setDownloadingPdf(true);
    try {
      const res = await reportsApi.generateInstitutionalReportPdf(buildDto(), token);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reporte-institucional-${periodStart}-${periodEnd}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo descargar el PDF");
    } finally {
      setDownloadingPdf(false);
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
        <div>
          <p className="text-label-md text-on-surface-variant mb-1">Nivel (opcional)</p>
          <Input
            type="text"
            placeholder="1ro Primaria"
            value={gradeLevel}
            onChange={(e) => setGradeLevel(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button onClick={handleGenerate} disabled={submitting || downloadingPdf}>
          {submitting ? "Generando..." : "Generar reporte"}
        </Button>
        <Button
          variant="secondary"
          onClick={handleDownloadPdf}
          disabled={submitting || downloadingPdf}
        >
          {downloadingPdf ? "Descargando..." : "Descargar PDF"}
        </Button>
      </div>

      {success && (
        <p className="text-body-md text-success">
          Reporte generado.{" "}
          <a
            href={`/api/reports/${success.csvFileId}/download`}
            className="underline text-primary"
          >
            Descargar CSV
          </a>
        </p>
      )}

      <FieldError message={error} />
    </div>
  );
}

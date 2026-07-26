"use client";

import { useState } from "react";
import { Button, FieldError, Input, Select } from "@/components/ui/form";
import { storageApi, accessibilityApi } from "@/lib/api";
import { getClientToken } from "@/lib/api/token";
import type { SupportLevel } from "@/lib/api/schemas/classroom";
import type { AccessibilityJob } from "@/lib/api/schemas/accessibility";

const ADAPTATION_LEVELS: SupportLevel[] = ["LEVE", "MODERADO", "SIGNIFICATIVO"];

export function ProcessContentForm() {
  const [file, setFile] = useState<File | null>(null);
  const [adaptationLevel, setAdaptationLevel] = useState<SupportLevel>("MODERADO");
  const [studentId, setStudentId] = useState("");
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [job, setJob] = useState<AccessibilityJob | null>(null);

  async function handleSubmit(e: React.FormEvent, mode: "process" | "worksheet") {
    e.preventDefault();
    setError(undefined);
    setJob(null);
    const token = getClientToken();
    if (!token || !file) return;

    setSubmitting(true);
    try {
      const uploaded = await storageApi.uploadFile(file, token);

      if (mode === "process") {
        const res = await accessibilityApi.processContent(
          {
            fileId: uploaded.id,
            fileName: file.name,
            fileType: file.type,
            adaptationLevel,
          },
          token
        );
        setJob(res.job);
      } else {
        const res = await accessibilityApi.generateWorksheet(
          {
            fileId: uploaded.id,
            fileName: file.name,
            fileType: file.type,
            adaptationLevel,
            studentId: studentId || undefined,
          },
          token
        );
        setJob(res.job);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo procesar el contenido");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1 min-w-xs">
          <Input
            type="file"
            accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            placeholder="Seleccionar archivo"
          />
        </div>
        <Select
          value={adaptationLevel}
          onChange={(e) => setAdaptationLevel(e.target.value as SupportLevel)}
          className="w-48"
        >
          {ADAPTATION_LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </Select>
        <Input
          placeholder="ID estudiante (opcional)"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="sm:w-48"
        />
      </div>

      <div className="flex gap-3">
        <Button
          onClick={(e) => handleSubmit(e, "process")}
          disabled={submitting || !file}
        >
          {submitting ? "Procesando..." : "Procesar contenido"}
        </Button>
        <Button
          variant="secondary"
          onClick={(e) => handleSubmit(e, "worksheet")}
          disabled={submitting || !file}
        >
          {submitting ? "Generando..." : "Generar ficha didáctica"}
        </Button>
      </div>

      <FieldError message={error} />

      {job && (
        <div className="flex flex-col gap-3 rounded-md border border-outline-variant p-4">
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-label-md ${
                job.status === "COMPLETED"
                  ? "bg-primary-container/25 text-on-primary-container"
                  : job.status === "FAILED"
                    ? "bg-error/20 text-error"
                    : "bg-surface-container-high text-on-surface-variant"
              }`}
            >
              {job.status}
            </span>
            <span className="text-label-md text-on-surface-variant">{job.fileName}</span>
          </div>

          {job.adaptedText && (
            <div>
              <p className="text-label-md uppercase tracking-wide text-on-surface-variant">
                Texto adaptado
              </p>
              <p className="mt-1 text-body-md text-on-surface">{job.adaptedText}</p>
            </div>
          )}

          {job.summaryText && (
            <div>
              <p className="text-label-md uppercase tracking-wide text-on-surface-variant">
                Resumen
              </p>
              <p className="mt-1 text-body-md text-on-surface">{job.summaryText}</p>
            </div>
          )}

          {job.audioFileId && (
            <div>
              <p className="text-label-md uppercase tracking-wide text-on-surface-variant">
                Audio
              </p>
              <a
                href={`/api/storage/${job.audioFileId}/download`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-body-md text-primary hover:underline"
              >
                Descargar audio (MP3)
              </a>
            </div>
          )}

          {job.subtitlesFileId && (
            <div>
              <p className="text-label-md uppercase tracking-wide text-on-surface-variant">
                Subtítulos
              </p>
              <a
                href={`/api/storage/${job.subtitlesFileId}/download`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-body-md text-primary hover:underline"
              >
                Descargar subtítulos (SRT)
              </a>
            </div>
          )}

          {job.worksheetFileId && (
            <div>
              <p className="text-label-md uppercase tracking-wide text-on-surface-variant">
                Ficha didáctica
              </p>
              <a
                href={`/api/storage/${job.worksheetFileId}/download`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-body-md text-primary hover:underline"
              >
                Descargar ficha (PDF)
              </a>
            </div>
          )}

          {job.pictogramData && job.pictogramData.length > 0 && (
            <div>
              <p className="text-label-md uppercase tracking-wide text-on-surface-variant">
                Pictogramas ARASAAC
              </p>
              <div className="mt-1 flex flex-wrap gap-2">
                {job.pictogramData.map((pictogram) => (
                  <span
                    key={pictogram.arasaacId}
                    className="rounded-full bg-primary-container/25 px-3 py-1 text-label-md text-on-primary-container"
                  >
                    {pictogram.keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {job.error && (
            <p className="text-body-md text-error">{job.error}</p>
          )}
        </div>
      )}
    </div>
  );
}

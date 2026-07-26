import { getServerToken } from "@/lib/api/token.server";
import { accessibilityApi } from "@/lib/api";
import { GlassCard } from "@/components/ui/glass-card";
import { ProcessContentForm } from "./_components/process-content-form";

export default async function AccessibilityPage() {
  const token = await getServerToken();
  const jobs = token ? await accessibilityApi.listJobs(token) : [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-headline-md text-on-surface">Accesibilidad</h1>

      <GlassCard>
        <h2 className="text-body-lg font-medium text-on-surface">Procesar contenido educativo</h2>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Sube un archivo (PDF, imagen, documento) para adaptarlo con OCR, generar audio con voz,
          subtítulos, pictogramas ARASAAC y fichas didácticas personalizadas.
        </p>
        <div className="mt-4">
          <ProcessContentForm />
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="text-body-lg font-medium text-on-surface">Trabajos anteriores</h2>
        {jobs.length === 0 ? (
          <p className="mt-2 text-body-md text-on-surface-variant">
            Aún no has procesado ningún contenido.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {jobs.map((job) => (
              <li
                key={job.id}
                className="flex items-center justify-between gap-4 rounded-md border border-outline-variant p-3"
              >
                <div>
                  <p className="text-body-md font-medium text-on-surface">{job.fileName}</p>
                  <p className="text-label-md text-on-surface-variant">
                    Nivel: {job.adaptationLevel} · {new Date(job.createdAt).toLocaleDateString("es-PE")}
                  </p>
                </div>
                <div className="flex gap-2">
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
                  {job.audioFileId && (
                    <a
                      href={`/api/storage/${job.audioFileId}/download`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-primary-container/25 px-3 py-1 text-label-md text-on-primary-container hover:opacity-80"
                    >
                      Audio
                    </a>
                  )}
                  {job.worksheetFileId && (
                    <a
                      href={`/api/storage/${job.worksheetFileId}/download`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-primary-container/25 px-3 py-1 text-label-md text-on-primary-container hover:opacity-80"
                    >
                      Ficha
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>
    </div>
  );
}

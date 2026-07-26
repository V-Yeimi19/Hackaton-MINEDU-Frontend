import { getServerToken } from "@/lib/api/token.server";
import { dashboardApi } from "@/lib/api";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";

const RISK_LABEL: Record<string, string> = {
  NONE: "Sin riesgo",
  LOW: "Bajo",
  MEDIUM: "Medio",
  HIGH: "Alto",
};

const RISK_TONE: Record<string, "primary" | "error" | "tertiary" | "neutral"> = {
  NONE: "primary",
  LOW: "neutral",
  MEDIUM: "tertiary",
  HIGH: "error",
};

export default async function AdminDashboardPage() {
  const token = await getServerToken();
  const summary = token ? await dashboardApi.summary.national(token).catch(() => null) : null;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-headline-md text-on-surface">Resumen nacional</h1>

      {!summary ? (
        <GlassCard>
          <p className="text-body-md text-on-surface-variant">
            No se pudo cargar el resumen nacional. Intenta de nuevo en unos minutos.
          </p>
        </GlassCard>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <GlassCard className="flex flex-col gap-1">
              <span className="text-label-md uppercase tracking-wide text-on-surface-variant">
                Total de estudiantes
              </span>
              <span className="text-headline-lg font-extrabold text-on-surface">
                {summary.totalStudents.toLocaleString("es-PE")}
              </span>
            </GlassCard>
            <GlassCard className="flex flex-col gap-1">
              <span className="text-label-md uppercase tracking-wide text-on-surface-variant">
                Instituciones activas
              </span>
              <span className="text-headline-lg font-extrabold text-on-surface">
                {summary.activeInstitutions.toLocaleString("es-PE")}
              </span>
            </GlassCard>
            <GlassCard className="flex flex-col gap-1">
              <span className="text-label-md uppercase tracking-wide text-on-surface-variant">
                Aulas totales
              </span>
              <span className="text-headline-lg font-extrabold text-on-surface">
                {summary.totalClassrooms.toLocaleString("es-PE")}
              </span>
            </GlassCard>
          </div>

          <GlassCard>
            <h2 className="text-body-lg font-medium text-on-surface">Riesgo a nivel nacional</h2>
            <p className="mt-1 text-body-md text-on-surface-variant">
              Estudiantes por nivel de riesgo, según el gemelo digital de cada aula.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {Object.entries(summary.riskCounts).map(([level, count]) => (
                <div
                  key={level}
                  className="flex items-center gap-2 rounded-md border border-outline-variant px-3 py-2"
                >
                  <Badge tone={RISK_TONE[level] ?? "neutral"}>{RISK_LABEL[level] ?? level}</Badge>
                  <span className="text-body-lg font-medium text-on-surface">{count}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <p className="text-label-md text-on-surface-variant">
            Calculado {new Date(summary.calculatedAt).toLocaleString("es-PE")}
          </p>
        </>
      )}
    </div>
  );
}

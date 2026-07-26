import { getServerToken } from "@/lib/api/token.server";
import { classroomApi, dashboardApi, analyticsApi } from "@/lib/api";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";

const SEVERITY_TONE = {
  LEVE: "neutral",
  MODERADO: "tertiary",
  GRAVE: "error",
} as const;

const RISK_LABEL = {
  NONE: "Sin riesgo",
  LOW: "Bajo",
  MEDIUM: "Medio",
  HIGH: "Alto",
} as const;

const RISK_TONE = {
  NONE: "primary",
  LOW: "neutral",
  MEDIUM: "tertiary",
  HIGH: "error",
} as const;

// Códigos reales que emite Analytics (apps/analytics/src/risk/risk.rules.ts +
// recommendation/recommendation.rules.ts) — cualquier código no mapeado cae
// al fallback "humanizado" en riskReasonLabel().
const RISK_REASON_LABEL: Record<string, string> = {
  attendance_below_threshold: "Asistencia por debajo del umbral",
  grade_below_threshold: "Notas por debajo del umbral",
  competency_below_threshold: "Competencias por debajo del umbral",
  suspicion_neurodivergence: "Posible necesidad de apoyo no diagnosticada",
};

function riskReasonLabel(reason: string): string {
  return (
    RISK_REASON_LABEL[reason] ??
    reason.replaceAll("_", " ").replace(/^\w/, (c) => c.toUpperCase())
  );
}

const COMPETENCY_LEVEL_TONE = {
  BASICO: "error",
  INTERMEDIO: "neutral",
  AVANZADO: "primary",
  LOGRADO: "tertiary",
} as const;

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const token = await getServerToken();
  if (!token) return null;

  const [student, grades, attendance, extras, indicators, competencies] = await Promise.all([
    classroomApi.students.get(id, token),
    classroomApi.grades.byStudent(id, token),
    classroomApi.attendance.byStudent(id, token),
    dashboardApi.studentExtras.get(id, token).catch(() => null),
    analyticsApi.indicators.byStudent(id, token).catch(() => ({ items: [], total: 0, page: 1, limit: 20 })),
    classroomApi.competencies.byStudent(id, token).catch(() => []),
  ]);

  // El gemelo digital está scoped por aula; se usa el aula del indicador más
  // reciente del estudiante (no hay un endpoint "gemelo digital por estudiante"
  // sin aula todavía).
  const primaryClassroomId = indicators.items[0]?.classroomId;
  const twin = primaryClassroomId
    ? await analyticsApi.digitalTwin
        .byStudentInClassroom(primaryClassroomId, id, token)
        .catch(() => null)
    : null;
  const uniqueRecommendations = twin
    ? Array.from(new Map(twin.recommendations.map((r) => [r.message, r])).values())
    : [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-headline-md text-on-surface">{student.fullName}</h1>

      {extras && (
        <div className="grid gap-4 sm:grid-cols-2">
          <GlassCard className="flex flex-col items-center gap-1 text-center">
            <span className="text-display-lg text-primary">{extras.creditsEarned}</span>
            <span className="text-label-md uppercase tracking-wide text-on-surface-variant">
              Créditos ganados
            </span>
          </GlassCard>
          <GlassCard>
            <h2 className="text-body-lg font-medium text-on-surface">Incidencias</h2>
            {extras.incidents.length === 0 ? (
              <p className="mt-2 text-body-md text-on-surface-variant">Sin incidencias registradas.</p>
            ) : (
              <ul className="mt-3 flex flex-col gap-2">
                {extras.incidents.map((incident) => (
                  <li key={incident.id} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-body-md text-on-surface">{incident.type}</p>
                      {incident.description && (
                        <p className="text-label-md text-on-surface-variant">{incident.description}</p>
                      )}
                    </div>
                    <Badge tone={SEVERITY_TONE[incident.severity]}>{incident.severity}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </GlassCard>
        </div>
      )}

      {twin && (
        <GlassCard>
          <div className="flex items-center justify-between">
            <h2 className="text-body-lg font-medium text-on-surface">Gemelo digital</h2>
            <Badge tone={RISK_TONE[twin.riskLevel]}>Riesgo {RISK_LABEL[twin.riskLevel]}</Badge>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex flex-col gap-1">
              <span className="text-label-md uppercase tracking-wide text-on-surface-variant">
                Asistencia
              </span>
              <span className="text-headline-md font-bold text-on-surface">
                {Math.round(twin.attendanceRate * 100)}%
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-label-md uppercase tracking-wide text-on-surface-variant">
                Nota prom.
              </span>
              <span className="text-headline-md font-bold text-on-surface">
                {twin.avgGrade.toFixed(1)}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-label-md uppercase tracking-wide text-on-surface-variant">
                Participación
              </span>
              <span className="text-headline-md font-bold text-on-surface">
                {Math.round(twin.participationScore * 100)}%
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-label-md uppercase tracking-wide text-on-surface-variant">
                Competencias
              </span>
              <span className="text-headline-md font-bold text-on-surface">
                {Math.round(twin.competencyScore * 100)}%
              </span>
            </div>
          </div>

          {twin.riskReasons.length > 0 && (
            <div className="mt-4 border-t border-outline-variant pt-4">
              <h3 className="text-label-md uppercase tracking-wide text-on-surface-variant">
                Motivos de riesgo
              </h3>
              <ul className="mt-2 flex flex-col gap-1">
                {twin.riskReasons.map((reason, i) => (
                  <li key={i} className="text-body-md text-on-surface-variant">
                    • {riskReasonLabel(reason)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {uniqueRecommendations.length > 0 && (
            <div className="mt-4 border-t border-outline-variant pt-4">
              <h3 className="text-label-md uppercase tracking-wide text-on-surface-variant">
                Recomendaciones
              </h3>
              {/* Analytics puede crear una Recommendation por cada evento que
                  reconfirma el mismo riesgo — se deduplica por mensaje para
                  no repetir la misma recomendación varias veces en la UI. */}
              <ul className="mt-2 flex flex-col gap-2">
                {uniqueRecommendations.map((rec) => (
                  <li key={rec.id} className="text-body-md text-on-surface-variant">
                    {rec.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </GlassCard>
      )}

      <GlassCard>
        <h2 className="text-body-lg font-medium text-on-surface">Competencias</h2>
        {competencies.length === 0 ? (
          <p className="mt-2 text-body-md text-on-surface-variant">Sin competencias evaluadas.</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {competencies.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3">
                <span className="text-body-md text-on-surface-variant">
                  {c.competency.name} ({c.competency.area})
                </span>
                <Badge tone={COMPETENCY_LEVEL_TONE[c.level]}>{c.level}</Badge>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>

      <GlassCard>
        <h2 className="text-body-lg font-medium text-on-surface">Notas</h2>
        {grades.length === 0 ? (
          <p className="mt-2 text-body-md text-on-surface-variant">Sin notas registradas.</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-1.5">
            {grades.map((grade) => (
              <li
                key={grade.id}
                className="flex justify-between text-body-md text-on-surface-variant"
              >
                <span>
                  {grade.course.name} — {grade.evaluation}
                </span>
                <span className="font-medium text-on-surface">{grade.score}/20</span>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>

      <GlassCard>
        <h2 className="text-body-lg font-medium text-on-surface">Asistencia</h2>
        {attendance.length === 0 ? (
          <p className="mt-2 text-body-md text-on-surface-variant">
            Sin registros de asistencia.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-1.5">
            {attendance.map((record) => (
              <li
                key={record.id}
                className="flex justify-between text-body-md text-on-surface-variant"
              >
                <span>{record.date}</span>
                <span className="font-medium text-on-surface">{record.status}</span>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>
    </div>
  );
}

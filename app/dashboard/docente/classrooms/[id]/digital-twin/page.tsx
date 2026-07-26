import { getServerToken } from "@/lib/api/token.server";
import { analyticsApi, classroomApi } from "@/lib/api";
import { GlassCard } from "@/components/ui/glass-card";
import { DismissRecommendationButton } from "./_components/dismiss-recommendation-button";

// Prisma RiskLevel real (analytics_db): NONE | LOW | MEDIUM | HIGH.
const RISK_STYLES: Record<string, string> = {
  NONE: "bg-primary-container/25 text-on-primary-container",
  LOW: "bg-primary-container/25 text-on-primary-container",
  MEDIUM: "bg-tertiary-container/25 text-tertiary",
  HIGH: "bg-error text-on-error",
};

export default async function DigitalTwinPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const token = await getServerToken();
  if (!token) return null;

  const [twin, roster, recommendations] = await Promise.all([
    analyticsApi.digitalTwin.byClassroom(id, token),
    classroomApi.classrooms.enrollments(id, token),
    analyticsApi.recommendations.byClassroom(id, token),
  ]);

  const studentName = (studentId: string) =>
    roster.find((r) => r.studentId === studentId)?.student.fullName ?? studentId;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-headline-md text-on-surface">Gemelo digital</h1>

      <GlassCard>
        <div className="flex gap-8">
          <div>
            <p className="text-display-lg text-on-surface">{twin.studentsCount}</p>
            <p className="text-label-md text-on-surface-variant">Estudiantes</p>
          </div>
          <div>
            <p className="text-display-lg text-tertiary">{twin.atRiskCount}</p>
            <p className="text-label-md text-on-surface-variant">En riesgo</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="text-body-lg font-medium text-on-surface">Estudiantes</h2>
        <ul className="mt-3 flex flex-col gap-3">
          {twin.students.map((s) => (
            <li
              key={s.studentId}
              className="flex flex-col gap-2 rounded-md border border-outline-variant p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-body-md font-medium text-on-surface">
                  {studentName(s.studentId)}
                </p>
                <p className="text-label-md text-on-surface-variant">
                  Asistencia {s.attendanceRate}% · Promedio {s.avgGrade}
                </p>
                {s.recommendations.length > 0 && (
                  <ul className="mt-1 list-inside list-disc text-label-md text-on-surface-variant">
                    {s.recommendations.map((rec) => (
                      <li key={rec.id}>{rec.message}</li>
                    ))}
                  </ul>
                )}
              </div>
              <span
                className={`w-fit rounded-full px-3 py-1 text-label-md ${RISK_STYLES[s.riskLevel] ?? ""}`}
              >
                {s.riskLevel}
              </span>
            </li>
          ))}
          {twin.students.length === 0 && (
            <li className="text-body-md text-on-surface-variant">
              Aún no hay datos suficientes para calcular el gemelo digital.
            </li>
          )}
        </ul>
      </GlassCard>

      <GlassCard>
        <h2 className="text-body-lg font-medium text-on-surface">Recomendaciones activas</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {recommendations.items
            .filter((r) => r.status !== "DISMISSED")
            .map((rec) => (
              <li
                key={rec.id}
                className="flex items-center justify-between gap-4 rounded-md border border-outline-variant p-3"
              >
                <div>
                  <p className="text-body-md text-on-surface">{rec.message}</p>
                  <p className="text-label-md text-on-surface-variant">
                    {studentName(rec.studentId)}
                  </p>
                </div>
                <DismissRecommendationButton id={rec.id} />
              </li>
            ))}
          {recommendations.items.filter((r) => r.status !== "DISMISSED").length === 0 && (
            <li className="text-body-md text-on-surface-variant">Sin recomendaciones activas.</li>
          )}
        </ul>
      </GlassCard>
    </div>
  );
}

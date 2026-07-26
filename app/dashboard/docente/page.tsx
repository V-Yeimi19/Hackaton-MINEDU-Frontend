import Link from "next/link";
import { getServerToken } from "@/lib/api/token.server";
import { classroomApi, dashboardApi } from "@/lib/api";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/form";

export default async function DocenteClassroomsPage() {
  const token = await getServerToken();
  const classrooms = token ? await classroomApi.classrooms.list(token) : [];
  const progressByClassroom = token
    ? await Promise.all(
        classrooms.map((c) =>
          dashboardApi.progress.byClassroom(c.id, token).catch(() => null)
        )
      )
    : [];
  const trackedProgress = progressByClassroom.filter(
    (p): p is NonNullable<typeof p> => p !== null && p.totalUnits > 0
  );
  const averageProgress =
    trackedProgress.length > 0
      ? Math.round(
          trackedProgress.reduce((sum, p) => sum + p.percentage, 0) / trackedProgress.length
        )
      : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-md text-on-surface">Mis aulas</h1>
        <Link href="/dashboard/docente/classrooms/new">
          <Button>Crear aula</Button>
        </Link>
      </div>

      {classrooms.length === 0 ? (
        <GlassCard>
          <p className="text-body-md text-on-surface-variant">
            Todavía no tienes aulas. Crea la primera para empezar a registrar cursos,
            asistencia y notas.
          </p>
        </GlassCard>
      ) : (
        <>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
            <GlassCard className="flex flex-col gap-1">
              <span className="text-label-md uppercase tracking-wide text-on-surface-variant">
                Aulas activas
              </span>
              <span className="text-headline-lg font-extrabold text-on-surface">
                {classrooms.length}
              </span>
            </GlassCard>
            <GlassCard className="flex flex-col gap-1">
              <span className="text-label-md uppercase tracking-wide text-on-surface-variant">
                Avance curricular promedio
              </span>
              <span className="text-headline-lg font-extrabold text-primary">
                {averageProgress === null ? "—" : `${averageProgress}%`}
              </span>
            </GlassCard>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
          {classrooms.map((classroom, i) => {
            const progress = progressByClassroom[i];
            return (
              <Link key={classroom.id} href={`/dashboard/docente/classrooms/${classroom.id}`}>
                <GlassCard className="h-full transition-transform hover:-translate-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-body-lg font-medium text-on-surface">{classroom.name}</h2>
                    {progress && progress.totalUnits > 0 && (
                      <Badge tone={progress.percentage >= 100 ? "primary" : "neutral"}>
                        {progress.percentage}%
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-body-md text-on-surface-variant">
                    {classroom.gradeLevel}
                  </p>
                </GlassCard>
              </Link>
            );
          })}
          </div>
        </>
      )}
    </div>
  );
}

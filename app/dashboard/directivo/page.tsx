import Link from "next/link";
import { getServerToken } from "@/lib/api/token.server";
import { classroomApi, dashboardApi } from "@/lib/api";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/form";

export default async function DirectivoInstitutionsPage() {
  const token = await getServerToken();
  const institutions = token ? await classroomApi.institutions.list(token) : [];
  const summaries = token
    ? await Promise.all(
        institutions.map((inst) => dashboardApi.summary.institution(inst.id, token).catch(() => null))
      )
    : [];
  const totalClassrooms = summaries.reduce((sum, s) => sum + (s?.classroomCount ?? 0), 0);
  const totalStudents = summaries.reduce((sum, s) => sum + (s?.studentCount ?? 0), 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-md text-on-surface">Mis instituciones</h1>
        <Link href="/dashboard/directivo/institutions/new">
          <Button>Crear institución</Button>
        </Link>
      </div>

      {institutions.length === 0 ? (
        <GlassCard>
          <p className="text-body-md text-on-surface-variant">
            Todavía no tienes instituciones. Crea la primera para empezar a gestionar aulas y docentes.
          </p>
        </GlassCard>
      ) : (
        <>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
            <GlassCard className="flex flex-col gap-1">
              <span className="text-label-md uppercase tracking-wide text-on-surface-variant">
                Instituciones
              </span>
              <span className="text-headline-lg font-extrabold text-on-surface">
                {institutions.length}
              </span>
            </GlassCard>
            <GlassCard className="flex flex-col gap-1">
              <span className="text-label-md uppercase tracking-wide text-on-surface-variant">
                Aulas totales
              </span>
              <span className="text-headline-lg font-extrabold text-on-surface">
                {totalClassrooms}
              </span>
            </GlassCard>
            <GlassCard className="flex flex-col gap-1">
              <span className="text-label-md uppercase tracking-wide text-on-surface-variant">
                Estudiantes totales
              </span>
              <span className="text-headline-lg font-extrabold text-primary">{totalStudents}</span>
            </GlassCard>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
          {institutions.map((inst) => (
            <Link key={inst.id} href={`/dashboard/directivo/institutions/${inst.id}`}>
              <GlassCard className="h-full transition-transform hover:-translate-y-1">
                <h2 className="text-body-lg font-medium text-on-surface">{inst.name}</h2>
                {inst.code && (
                  <p className="mt-1 text-body-md text-on-surface-variant">Código: {inst.code}</p>
                )}
                {inst.address && (
                  <p className="mt-1 text-body-md text-on-surface-variant">{inst.address}</p>
                )}
              </GlassCard>
            </Link>
          ))}
          </div>
        </>
      )}
    </div>
  );
}

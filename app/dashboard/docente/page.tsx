import Link from "next/link";
import { getServerToken } from "@/lib/api/token.server";
import { classroomApi } from "@/lib/api";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/form";

export default async function DocenteClassroomsPage() {
  const token = await getServerToken();
  const classrooms = token ? await classroomApi.classrooms.list(token) : [];

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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classrooms.map((classroom) => (
            <Link key={classroom.id} href={`/dashboard/docente/classrooms/${classroom.id}`}>
              <GlassCard className="h-full transition-opacity hover:opacity-90">
                <h2 className="text-body-lg font-medium text-on-surface">{classroom.name}</h2>
                <p className="mt-1 text-body-md text-on-surface-variant">
                  {classroom.gradeLevel}
                </p>
              </GlassCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

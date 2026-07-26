import Link from "next/link";
import { getServerToken } from "@/lib/api/token.server";
import { classroomApi } from "@/lib/api";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/form";

export default async function FamiliarStudentsPage() {
  const token = await getServerToken();
  const children = token ? await classroomApi.students.list(token) : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-md text-on-surface">Mis hijos</h1>
        <Link href="/dashboard/familiar/students/new">
          <Button>Registrar hijo</Button>
        </Link>
      </div>

      {children.length === 0 ? (
        <GlassCard>
          <p className="text-body-md text-on-surface-variant">
            Aún no has registrado a ningún hijo. Regístralo para poder aceptar invitaciones de
            aula y ver sus notas y asistencia.
          </p>
        </GlassCard>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {children.map((student) => (
            <Link key={student.id} href={`/dashboard/familiar/students/${student.id}`}>
              <GlassCard className="h-full transition-opacity hover:opacity-90">
                <h2 className="text-body-lg font-medium text-on-surface">{student.fullName}</h2>
                <p className="mt-1 text-body-md text-on-surface-variant">
                  {student.enrollments.length > 0
                    ? `${student.enrollments.length} aula(s) matriculada(s)`
                    : "Sin aula matriculada"}
                </p>
              </GlassCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

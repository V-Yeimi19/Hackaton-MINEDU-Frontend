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
        <h1 className="text-headline-md text-on-surface">Mi(s) hij@(s)</h1>
        <Link href="/dashboard/familiar/students/new">
          <Button>Registrar hijo</Button>
        </Link>
      </div>

      {children.length === 0 ? (
        <GlassCard>
          <p className="text-body-md text-on-surface-variant">
            Aún no has registrado a ningún hij@. Regístralo para poder aceptar invitaciones de
            aula y ver sus notas y asistencia.
          </p>
        </GlassCard>
      ) : (
        <>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
            <GlassCard className="flex flex-col gap-1">
              <span className="text-label-md uppercase tracking-wide text-on-surface-variant">
                Hij@s registrados
              </span>
              <span className="text-headline-lg font-extrabold text-on-surface">
                {children.length}
              </span>
            </GlassCard>
            <GlassCard className="flex flex-col gap-1">
              <span className="text-label-md uppercase tracking-wide text-on-surface-variant">
                Necesidades de apoyo
              </span>
              <span className="text-headline-lg font-extrabold text-primary">
                {children.reduce((sum, s) => sum + s.supportNeeds.length, 0)}
              </span>
            </GlassCard>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
            {children.map((student) => (
              <Link key={student.id} href={`/dashboard/familiar/students/${student.id}`}>
                <GlassCard className="h-full transition-transform hover:-translate-y-1">
                  <h2 className="text-body-lg font-medium text-on-surface">{student.fullName}</h2>
                  <p className="mt-1 text-body-md text-on-surface-variant">
                    {student.supportNeeds.length > 0
                      ? `${student.supportNeeds.length} necesidad(es) de apoyo registrada(s)`
                      : "Ver detalles"}
                  </p>
                </GlassCard>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

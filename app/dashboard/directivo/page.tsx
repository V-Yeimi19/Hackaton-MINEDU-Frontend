import Link from "next/link";
import { getServerToken } from "@/lib/api/token.server";
import { classroomApi } from "@/lib/api";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/form";

export default async function DirectivoInstitutionsPage() {
  const token = await getServerToken();
  const institutions = token ? await classroomApi.institutions.list(token) : [];

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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
      )}
    </div>
  );
}

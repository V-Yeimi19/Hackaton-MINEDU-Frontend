import { getServerUser, getServerToken } from "@/lib/api/token.server";
import { usersApi } from "@/lib/api";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/form";
import { EditProfileForm } from "./_components/edit-profile-form";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DocenteProfilePage() {
  const sessionUser = await getServerUser();
  if (!sessionUser) redirect("/login");

  const token = await getServerToken();
  if (!token) redirect("/login");

  const user = await usersApi.getMe(token);

  const roleLabels: Record<string, string> = {
    ADMIN: "Administrador",
    DIRECTIVO: "Directivo",
    DOCENTE: "Docente",
    FAMILIAR: "Familiar",
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-headline-md text-on-surface">Mi perfil</h1>
        <Link href="/dashboard/docente">
          <Button variant="secondary">Volver</Button>
        </Link>
      </div>

      <GlassCard>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-label-md text-on-surface-variant">Nombre completo</p>
            <p className="text-body-lg text-on-surface">{user.fullName}</p>
          </div>
          <div>
            <p className="text-label-md text-on-surface-variant">Correo electrónico</p>
            <p className="text-body-lg text-on-surface">{user.email}</p>
          </div>
          <div>
            <p className="text-label-md text-on-surface-variant">Rol</p>
            <p className="text-body-lg text-on-surface">{roleLabels[user.role] ?? user.role}</p>
          </div>
          <div>
            <p className="text-label-md text-on-surface-variant">Fecha de registro</p>
            <p className="text-body-lg text-on-surface">
              {new Date(user.createdAt).toLocaleDateString("es-PE", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="text-body-lg font-medium text-on-surface">Editar perfil</h2>
        <div className="mt-4">
          <EditProfileForm user={user} />
        </div>
      </GlassCard>
    </div>
  );
}

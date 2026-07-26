import Link from "next/link";
import { getServerToken, getServerUser } from "@/lib/api/token.server";
import { classroomApi } from "@/lib/api";
import { ApiError } from "@/lib/api/http";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/form";
import { AcceptInvitationForm } from "./_components/accept-invitation-form";

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const user = await getServerUser();
  const authToken = await getServerToken();

  let invitation;
  try {
    invitation = await classroomApi.invitations.byToken(token);
  } catch (err) {
    return (
      <main className="glass-ambient flex min-h-screen items-center justify-center px-6 py-16">
        <GlassCard className="w-full max-w-md">
          <h1 className="text-headline-md text-on-surface">Invitación no encontrada</h1>
          <p className="mt-2 text-body-md text-on-surface-variant">
            {err instanceof ApiError ? err.message : "No se pudo cargar la invitación."}
          </p>
        </GlassCard>
      </main>
    );
  }

  const redirectParam = encodeURIComponent(`/invitations/${token}`);

  return (
    <main className="glass-ambient flex min-h-screen items-center justify-center px-6 py-16">
      <GlassCard className="w-full max-w-md">
        <h1 className="text-headline-md text-on-surface">Invitación a aula</h1>
        <p className="mt-2 text-body-md text-on-surface-variant">
          Invitación para <strong>{invitation.email}</strong>
        </p>

        <div className="mt-6">
          {invitation.status !== "PENDING" ? (
            <p className="text-body-md text-on-surface-variant">
              Esta invitación ya no está disponible.
            </p>
          ) : invitation.type !== "FAMILY_TO_CLASSROOM" ? (
            <p className="text-body-md text-on-surface-variant">
              Este tipo de invitación aún no se maneja desde esta pantalla.
            </p>
          ) : !user ? (
            <div className="flex flex-col gap-3">
              <p className="text-body-md text-on-surface-variant">
                Inicia sesión o regístrate como familiar para aceptar esta invitación.
              </p>
              <div className="flex gap-3">
                <Link href={`/login?redirect=${redirectParam}`}>
                  <Button>Iniciar sesión</Button>
                </Link>
                <Link href={`/register?redirect=${redirectParam}`}>
                  <Button variant="secondary">Registrarme</Button>
                </Link>
              </div>
            </div>
          ) : user.role !== "FAMILIAR" ? (
            <p className="text-body-md text-on-surface-variant">
              Solo una cuenta con rol Familiar puede aceptar esta invitación.
            </p>
          ) : (
            <AcceptFamilyStudents token={token} authToken={authToken!} />
          )}
        </div>
      </GlassCard>
    </main>
  );
}

async function AcceptFamilyStudents({ token, authToken }: { token: string; authToken: string }) {
  const students = await classroomApi.students.list(authToken);
  return <AcceptInvitationForm token={token} students={students} />;
}

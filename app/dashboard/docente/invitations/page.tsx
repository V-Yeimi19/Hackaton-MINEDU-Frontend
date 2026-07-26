import { getServerToken } from "@/lib/api/token.server";
import { classroomApi } from "@/lib/api";
import { GlassCard } from "@/components/ui/glass-card";
import { RevokeInvitationButton } from "./_components/revoke-invitation-button";
import type { InvitationStatus } from "@/lib/api/schemas/classroom";

const STATUS_STYLES: Record<InvitationStatus, string> = {
  PENDING: "bg-secondary-container/30 text-secondary",
  ACCEPTED: "bg-primary-container/30 text-primary",
  REVOKED: "bg-error-container/30 text-error",
  EXPIRED: "bg-surface-container-high text-on-surface-variant",
};

const TYPE_LABELS: Record<string, string> = {
  FAMILY_TO_CLASSROOM: "Familia → Aula",
  TEACHER_TO_INSTITUTION: "Docente → Institución",
};

export default async function InvitationsPage() {
  const token = await getServerToken();
  const invitations = token ? await classroomApi.invitations.list(token) : [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-headline-md text-on-surface">Mis invitaciones</h1>

      {invitations.length === 0 ? (
        <GlassCard>
          <p className="text-body-md text-on-surface-variant">
            Aún no has creado invitaciones.
          </p>
        </GlassCard>
      ) : (
        <GlassCard>
          <div className="overflow-x-auto">
            <table className="w-full text-body-md">
              <thead>
                <tr className="border-b border-outline-variant text-left text-label-md uppercase tracking-wide text-on-surface-variant">
                  <th className="pb-2 pr-4">Correo</th>
                  <th className="pb-2 pr-4">Tipo</th>
                  <th className="pb-2 pr-4">Estado</th>
                  <th className="pb-2 pr-4">Fecha</th>
                  <th className="pb-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {invitations.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-b border-outline-variant/50 last:border-0"
                  >
                    <td className="py-3 pr-4 text-on-surface">{inv.email}</td>
                    <td className="py-3 pr-4 text-on-surface-variant">
                      {TYPE_LABELS[inv.type] ?? inv.type}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-label-sm ${STATUS_STYLES[inv.status]}`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-on-surface-variant">
                      {new Date(inv.createdAt).toLocaleDateString("es-PE")}
                    </td>
                    <td className="py-3">
                      {inv.status === "PENDING" && (
                        <RevokeInvitationButton invitationId={inv.id} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  );
}

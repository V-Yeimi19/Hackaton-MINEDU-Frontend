import { getServerToken } from "@/lib/api/token.server";
import { classroomApi } from "@/lib/api";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeaderRow,
  TableRow,
} from "@/components/ui/table";
import { RevokeInvitationButton } from "./_components/revoke-invitation-button";
import type { InvitationStatus } from "@/lib/api/schemas/classroom";

const STATUS_TONE: Record<InvitationStatus, "primary" | "error" | "tertiary" | "neutral"> = {
  PENDING: "neutral",
  ACCEPTED: "primary",
  REVOKED: "error",
  EXPIRED: "neutral",
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
          <Table>
            <TableHeader>
              <TableHeaderRow>
                <TableHead>Correo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Acciones</TableHead>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {invitations.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell>{inv.email}</TableCell>
                  <TableCell className="text-on-surface-variant">
                    {TYPE_LABELS[inv.type] ?? inv.type}
                  </TableCell>
                  <TableCell>
                    <Badge tone={STATUS_TONE[inv.status]}>{inv.status}</Badge>
                  </TableCell>
                  <TableCell className="text-on-surface-variant">
                    {new Date(inv.createdAt).toLocaleDateString("es-PE")}
                  </TableCell>
                  <TableCell>
                    {inv.status === "PENDING" && (
                      <RevokeInvitationButton invitationId={inv.id} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </GlassCard>
      )}
    </div>
  );
}

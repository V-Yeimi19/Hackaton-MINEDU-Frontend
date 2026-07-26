import { getServerToken } from "@/lib/api/token.server";
import { classroomApi, dashboardApi } from "@/lib/api";
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
import { EditInstitutionForm } from "./_components/edit-institution-form";
import { DeleteInstitutionButton } from "./_components/delete-institution-button";
import { InviteTeacherForm } from "./_components/invite-teacher-form";
import { RevokeInvitationButton } from "./_components/revoke-invitation-button";
import { GenerateInstitutionalReportButton } from "../_components/generate-institutional-report-button";
import type { InvitationStatus } from "@/lib/api/schemas/classroom";

const STATUS_TONE: Record<InvitationStatus, "primary" | "error" | "tertiary" | "neutral"> = {
  PENDING: "neutral",
  ACCEPTED: "primary",
  REVOKED: "error",
  EXPIRED: "neutral",
};

export default async function InstitutionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const token = await getServerToken();
  if (!token) return null;

  const [institution, allInvitations, summary] = await Promise.all([
    classroomApi.institutions.get(id, token),
    classroomApi.invitations.list(token),
    dashboardApi.summary.institution(id, token).catch(() => null),
  ]);

  const invitations = allInvitations.filter((inv) => inv.institutionId === id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md text-on-surface">{institution.name}</h1>
          {institution.code && (
            <p className="text-body-md text-on-surface-variant">Código: {institution.code}</p>
          )}
          {institution.address && (
            <p className="text-body-md text-on-surface-variant">{institution.address}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <DeleteInstitutionButton institutionId={id} />
        </div>
      </div>

      {summary && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <GlassCard className="flex flex-col gap-1">
            <span className="text-label-md uppercase tracking-wide text-on-surface-variant">Aulas</span>
            <span className="text-headline-lg font-extrabold text-on-surface">{summary.classroomCount}</span>
          </GlassCard>
          <GlassCard className="flex flex-col gap-1">
            <span className="text-label-md uppercase tracking-wide text-on-surface-variant">Estudiantes</span>
            <span className="text-headline-lg font-extrabold text-on-surface">{summary.studentCount}</span>
          </GlassCard>
          <GlassCard className="flex flex-col gap-1">
            <span className="text-label-md uppercase tracking-wide text-on-surface-variant">Asistencia prom.</span>
            <span className="text-headline-lg font-extrabold text-primary">
              {Math.round(summary.avgAttendanceRate * 100)}%
            </span>
          </GlassCard>
          <GlassCard className="flex flex-col gap-1">
            <span className="text-label-md uppercase tracking-wide text-on-surface-variant">Nota prom.</span>
            <span className="text-headline-lg font-extrabold text-primary">
              {summary.avgGrade.toFixed(1)}
            </span>
          </GlassCard>
        </div>
      )}

      <GlassCard>
        <h2 className="text-body-lg font-medium text-on-surface">Editar institución</h2>
        <div className="mt-4">
          <EditInstitutionForm
            institutionId={id}
            initialName={institution.name}
            initialCode={institution.code ?? ""}
            initialAddress={institution.address ?? ""}
          />
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="text-body-lg font-medium text-on-surface">
          Aulas <span className="text-on-surface-variant">({institution.classrooms.length})</span>
        </h2>
        {institution.classrooms.length > 0 ? (
          <ul className="mt-3 flex flex-col gap-2">
            {institution.classrooms.map((classroom) => (
              <li
                key={classroom.id}
                className="rounded-md border border-outline-variant px-4 py-2 text-body-md text-on-surface"
              >
                {classroom.name} — {classroom.gradeLevel}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-body-md text-on-surface-variant">
            Aún no hay aulas en esta institución.
          </p>
        )}
      </GlassCard>

      <GlassCard>
        <h2 className="text-body-lg font-medium text-on-surface">
          Docentes <span className="text-on-surface-variant">({institution.teachers.length})</span>
        </h2>
        {institution.teachers.length > 0 ? (
          <ul className="mt-3 flex flex-col gap-2">
            {institution.teachers.map((teacher) => (
              <li
                key={teacher.id}
                className="rounded-md border border-outline-variant px-4 py-2 text-body-md text-on-surface"
              >
                {teacher.teacherId}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-body-md text-on-surface-variant">
            Aún no hay docentes en esta institución.
          </p>
        )}
      </GlassCard>

      <GlassCard>
        <h2 className="text-body-lg font-medium text-on-surface">Invitar docente</h2>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Envía una invitación para que un docente se una a esta institución.
        </p>
        <div className="mt-4">
          <InviteTeacherForm institutionId={id} />
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="text-body-lg font-medium text-on-surface">Invitaciones</h2>
        {invitations.length > 0 ? (
          <div className="mt-3">
            <Table>
              <TableHeader>
                <TableHeaderRow>
                  <TableHead>Correo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableHeaderRow>
              </TableHeader>
              <TableBody>
                {invitations.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>{inv.email}</TableCell>
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
          </div>
        ) : (
          <p className="mt-2 text-body-md text-on-surface-variant">
            Aún no hay invitaciones para esta institución.
          </p>
        )}
      </GlassCard>

      <GlassCard>
        <h2 className="text-body-lg font-medium text-on-surface">Reporte institucional</h2>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Genera un reporte consolidado (CSV + PDF) de todas las aulas de la institución en un periodo.
        </p>
        <div className="mt-4">
          <GenerateInstitutionalReportButton />
        </div>
      </GlassCard>
    </div>
  );
}

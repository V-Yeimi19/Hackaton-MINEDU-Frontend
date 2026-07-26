import { getServerToken } from "@/lib/api/token.server";
import { classroomApi } from "@/lib/api";
import { GlassCard } from "@/components/ui/glass-card";
import { EditInstitutionForm } from "./_components/edit-institution-form";
import { DeleteInstitutionButton } from "./_components/delete-institution-button";
import { InviteTeacherForm } from "./_components/invite-teacher-form";
import { RevokeInvitationButton } from "./_components/revoke-invitation-button";
import { GenerateInstitutionalReportButton } from "../_components/generate-institutional-report-button";
import type { InvitationStatus } from "@/lib/api/schemas/classroom";

const STATUS_STYLES: Record<InvitationStatus, string> = {
  PENDING: "bg-secondary-container/30 text-secondary",
  ACCEPTED: "bg-primary-container/30 text-primary",
  REVOKED: "bg-error-container/30 text-error",
  EXPIRED: "bg-surface-container-high text-on-surface-variant",
};

export default async function InstitutionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const token = await getServerToken();
  if (!token) return null;

  const [institution, allInvitations] = await Promise.all([
    classroomApi.institutions.get(id, token),
    classroomApi.invitations.list(token),
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
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-body-md">
              <thead>
                <tr className="border-b border-outline-variant text-left text-label-md uppercase tracking-wide text-on-surface-variant">
                  <th className="pb-2 pr-4">Correo</th>
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

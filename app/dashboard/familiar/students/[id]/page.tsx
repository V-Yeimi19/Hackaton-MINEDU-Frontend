import { getServerToken } from "@/lib/api/token.server";
import { classroomApi } from "@/lib/api";
import { GlassCard } from "@/components/ui/glass-card";

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const token = await getServerToken();
  if (!token) return null;

  const [student, grades, attendance] = await Promise.all([
    classroomApi.students.get(id, token),
    classroomApi.grades.byStudent(id, token),
    classroomApi.attendance.byStudent(id, token),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-headline-md text-on-surface">{student.fullName}</h1>

      <GlassCard>
        <h2 className="text-body-lg font-medium text-on-surface">Notas</h2>
        {grades.length === 0 ? (
          <p className="mt-2 text-body-md text-on-surface-variant">Sin notas registradas.</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-1.5">
            {grades.map((grade) => (
              <li
                key={grade.id}
                className="flex justify-between text-body-md text-on-surface-variant"
              >
                <span>
                  {grade.course.name} — {grade.evaluation}
                </span>
                <span className="font-medium text-on-surface">{grade.score}/20</span>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>

      <GlassCard>
        <h2 className="text-body-lg font-medium text-on-surface">Asistencia</h2>
        {attendance.length === 0 ? (
          <p className="mt-2 text-body-md text-on-surface-variant">
            Sin registros de asistencia.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-1.5">
            {attendance.map((record) => (
              <li
                key={record.id}
                className="flex justify-between text-body-md text-on-surface-variant"
              >
                <span>{record.date}</span>
                <span className="font-medium text-on-surface">{record.status}</span>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>
    </div>
  );
}

import Link from "next/link";
import { getServerToken } from "@/lib/api/token.server";
import { classroomApi } from "@/lib/api";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/form";
import { CreateCourseForm } from "./_components/create-course-form";
import { InviteFamilyForm } from "./_components/invite-family-form";
import { AttendanceForm } from "./_components/attendance-form";
import { GradeForm } from "./_components/grade-form";

export default async function ClassroomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const token = await getServerToken();
  if (!token) return null;

  const [classroom, roster, grades] = await Promise.all([
    classroomApi.classrooms.get(id, token),
    classroomApi.classrooms.enrollments(id, token),
    classroomApi.grades.byClassroom(id, token),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md text-on-surface">{classroom.name}</h1>
          <p className="text-body-md text-on-surface-variant">{classroom.gradeLevel}</p>
        </div>
        <Link href={`/dashboard/docente/classrooms/${id}/digital-twin`}>
          <Button variant="secondary">Ver gemelo digital</Button>
        </Link>
      </div>

      <GlassCard>
        <h2 className="text-body-lg font-medium text-on-surface">Cursos</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {classroom.courses.map((course) => (
            <li
              key={course.id}
              className="rounded-full bg-primary-container/25 px-3 py-1 text-label-md text-on-primary-container"
            >
              {course.name}
            </li>
          ))}
          {classroom.courses.length === 0 && (
            <li className="text-body-md text-on-surface-variant">Aún no hay cursos.</li>
          )}
        </ul>
        <div className="mt-4">
          <CreateCourseForm classroomId={id} />
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="text-body-lg font-medium text-on-surface">Invitar familia</h2>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Envía una invitación para que un familiar matricule a su hijo en esta aula.
        </p>
        <div className="mt-4">
          <InviteFamilyForm classroomId={id} />
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="text-body-lg font-medium text-on-surface">Asistencia de hoy</h2>
        <div className="mt-4">
          <AttendanceForm classroomId={id} roster={roster} />
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="text-body-lg font-medium text-on-surface">Registrar nota</h2>
        <div className="mt-4">
          <GradeForm classroomId={id} roster={roster} courses={classroom.courses} />
        </div>
        {grades.length > 0 && (
          <ul className="mt-4 flex flex-col gap-1.5 border-t border-outline-variant pt-4">
            {grades.map((grade) => (
              <li key={grade.id} className="flex justify-between text-body-md text-on-surface-variant">
                <span>
                  {grade.course.name} — {grade.evaluation}
                </span>
                <span className="font-medium text-on-surface">{grade.score}/20</span>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>
    </div>
  );
}

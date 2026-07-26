import Link from "next/link";
import { getServerToken } from "@/lib/api/token.server";
import { classroomApi, dashboardApi } from "@/lib/api";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/form";
import { CourseProgressForm } from "./_components/course-progress-form";
import { CreateCourseForm } from "./_components/create-course-form";
import { InviteFamilyForm } from "./_components/invite-family-form";
import { AttendanceForm } from "./_components/attendance-form";
import { GradeForm } from "./_components/grade-form";
import { CreateCompetencyForm } from "./_components/create-competency-form";
import { EvaluateCompetencyForm } from "./_components/evaluate-competency-form";
import { SupportNeedForm } from "./_components/support-need-form";
import { EditSupportNeedForm } from "./_components/edit-support-need-form";
import { DeleteSupportNeedButton } from "./_components/delete-support-need-button";
import { StudentCompetencies } from "./_components/student-competencies";
import { GenerateClassroomReportButton } from "./_components/generate-classroom-report-button";
import { GenerateStudentReportButton } from "./_components/generate-student-report-button";
import { GenerateAiReportForm } from "./_components/generate-ai-report-form";
import { EditGradeForm } from "./_components/edit-grade-form";
import { DeleteGradeButton } from "./_components/delete-grade-button";
import { AttendanceHistory } from "./_components/attendance-history";
import { EditClassroomForm } from "./_components/edit-classroom-form";
import { DeleteClassroomButton } from "./_components/delete-classroom-button";
import { RemoveEnrollmentButton } from "./_components/remove-enrollment-button";
import { EditCourseForm } from "./_components/edit-course-form";
import { DeleteCourseButton } from "./_components/delete-course-button";

export default async function ClassroomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const token = await getServerToken();
  if (!token) return null;

  const [classroom, roster, grades, competencies] = await Promise.all([
    classroomApi.classrooms.get(id, token),
    classroomApi.classrooms.enrollments(id, token),
    classroomApi.grades.byClassroom(id, token),
    classroomApi.competencies.list(token),
  ]);

  const supportNeedsByStudent = await Promise.all(
    roster.map((r) =>
      classroomApi.supportNeeds.byStudent(r.studentId, token).catch(() => [])
    )
  );

  const [classroomProgress, courseProgress] = await Promise.all([
    dashboardApi.progress.byClassroom(id, token).catch(() => null),
    Promise.all(
      classroom.courses.map((course) =>
        dashboardApi.progress
          .byCourse(course.id, token)
          .catch(() => ({ courseId: course.id, totalUnits: 0, completedUnits: 0, percentage: 0 }))
      )
    ),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-md text-on-surface">{classroom.name}</h1>
          <p className="text-body-md text-on-surface-variant">{classroom.gradeLevel}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/docente/classrooms/${id}/digital-twin`}>
            <Button variant="secondary">Ver gemelo digital</Button>
          </Link>
          <DeleteClassroomButton classroomId={id} />
        </div>
      </div>

      <GlassCard>
        <h2 className="text-body-lg font-medium text-on-surface">Editar aula</h2>
        <div className="mt-4">
          <EditClassroomForm
            classroomId={id}
            initialName={classroom.name}
            initialGradeLevel={classroom.gradeLevel}
          />
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="text-body-lg font-medium text-on-surface">Cursos</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {classroom.courses.map((course) => (
            <li key={course.id} className="flex items-center gap-1">
              <EditCourseForm course={course} />
              <DeleteCourseButton courseId={course.id} />
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
        <div className="flex items-center justify-between">
          <h2 className="text-body-lg font-medium text-on-surface">Avance curricular</h2>
          {classroomProgress && (
            <Badge tone={classroomProgress.percentage >= 100 ? "primary" : "neutral"}>
              {classroomProgress.percentage}% del aula
            </Badge>
          )}
        </div>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Registra cuántas unidades tiene cada curso y cuántas ya completaste.
        </p>
        {classroom.courses.length === 0 ? (
          <p className="mt-3 text-body-md text-on-surface-variant">
            Crea un curso primero para poder registrar su avance.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {classroom.courses.map((course, i) => (
              <CourseProgressForm
                key={course.id}
                courseId={course.id}
                courseName={course.name}
                initialProgress={courseProgress[i]}
              />
            ))}
          </div>
        )}
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
        <h2 className="text-body-lg font-medium text-on-surface">Estudiantes matriculados</h2>
        {roster.length > 0 ? (
          <ul className="mt-3 flex flex-col gap-2">
            {roster.map((enrollment) => (
              <li
                key={enrollment.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-outline-variant px-4 py-2"
              >
                <span className="text-body-md text-on-surface">{enrollment.student.fullName}</span>
                <div className="flex items-center gap-2">
                  <GenerateStudentReportButton
                    studentId={enrollment.studentId}
                    classroomId={id}
                  />
                  <RemoveEnrollmentButton
                    classroomId={id}
                    enrollmentId={enrollment.id}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-body-md text-on-surface-variant">Aún no hay estudiantes matriculados.</p>
        )}
      </GlassCard>

      <GlassCard>
        <h2 className="text-body-lg font-medium text-on-surface">Asistencia de hoy</h2>
        <div className="mt-4">
          <AttendanceForm classroomId={id} roster={roster} />
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="text-body-lg font-medium text-on-surface">Historial de asistencia</h2>
        <div className="mt-4">
          <AttendanceHistory classroomId={id} roster={roster} />
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
              <li key={grade.id} className="flex items-center justify-between text-body-md text-on-surface-variant">
                <span>
                  {grade.course.name} — {grade.evaluation}
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-on-surface">{grade.score}/20</span>
                  <EditGradeForm grade={grade} />
                  <DeleteGradeButton gradeId={grade.id} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>

      <GlassCard>
        <h2 className="text-body-lg font-medium text-on-surface">Competencias</h2>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Crea competencias por área y evalúa el nivel de cada estudiante.
        </p>
        <div className="mt-4">
          <CreateCompetencyForm />
        </div>
        {competencies.length > 0 && (
          <div className="mt-4 border-t border-outline-variant pt-4">
            <h3 className="text-label-md uppercase tracking-wide text-on-surface-variant mb-3">
              Evaluar estudiante
            </h3>
            <EvaluateCompetencyForm
              classroomId={id}
              roster={roster}
              courses={classroom.courses}
              competencies={competencies}
            />
          </div>
        )}
        {roster.length > 0 && (
          <div className="mt-4 border-t border-outline-variant pt-4 flex flex-col gap-3">
            <h3 className="text-label-md uppercase tracking-wide text-on-surface-variant">
              Competencias por estudiante
            </h3>
            {roster.map((r) => (
              <StudentCompetencies
                key={r.studentId}
                studentId={r.studentId}
                studentName={r.student.fullName}
              />
            ))}
          </div>
        )}
      </GlassCard>

      <GlassCard>
        <h2 className="text-body-lg font-medium text-on-surface">Necesidades de apoyo</h2>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Registra necesidades especiales de tus estudiantes matriculados.
        </p>
        <div className="mt-4">
          <SupportNeedForm classroomId={id} roster={roster} />
        </div>
        {roster.length > 0 && (
          <div className="mt-4 border-t border-outline-variant pt-4 flex flex-col gap-4">
            {roster.map((r, i) => {
              const needs = supportNeedsByStudent[i] ?? [];
              if (needs.length === 0) return null;
              return (
                <div key={r.studentId}>
                  <h3 className="text-label-md uppercase tracking-wide text-on-surface-variant mb-2">
                    {r.student.fullName}
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {needs.map((need) => (
                      <li
                        key={need.id}
                        className="flex items-center gap-2 rounded-md border border-outline-variant px-3 py-2"
                      >
                        <div className="flex-1 min-w-0">
                          <EditSupportNeedForm need={need} />
                        </div>
                        <DeleteSupportNeedButton needId={need.id} />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>

      <GlassCard>
        <h2 className="text-body-lg font-medium text-on-surface">Reporte del aula (PDF)</h2>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Genera un reporte PDF con asistencia, notas y riesgo de los estudiantes del aula en un periodo.
        </p>
        <div className="mt-4">
          <GenerateClassroomReportButton classroomId={id} />
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="text-body-lg font-medium text-on-surface">Reporte semanal con IA</h2>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Análisis inteligente de asistencia, notas y anomalías detectadas por IA en tu aula.
        </p>
        <div className="mt-4">
          <GenerateAiReportForm classroomId={id} />
        </div>
      </GlassCard>
    </div>
  );
}

import { z } from "zod";

// ---------- Enums ----------

export const supportNeedTypeSchema = z.enum([
  "DISCAPACIDAD_VISUAL",
  "DISCAPACIDAD_AUDITIVA",
  "DISCAPACIDAD_INTELECTUAL",
  "DISCAPACIDAD_MOTORA",
  "TRASTORNO_ESPECTRO_AUTISTA",
  "DIFICULTAD_APRENDIZAJE",
  "TDAH",
  "MULTIDISCAPACIDAD",
  "OTRO",
]);
export type SupportNeedType = z.infer<typeof supportNeedTypeSchema>;

export const supportLevelSchema = z.enum(["LEVE", "MODERADO", "SIGNIFICATIVO"]);
export type SupportLevel = z.infer<typeof supportLevelSchema>;

export const attendanceStatusSchema = z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]);
export type AttendanceStatus = z.infer<typeof attendanceStatusSchema>;

export const competencyLevelSchema = z.enum(["BASICO", "INTERMEDIO", "AVANZADO", "LOGRADO"]);
export type CompetencyLevel = z.infer<typeof competencyLevelSchema>;

export const invitationTypeSchema = z.enum(["TEACHER_TO_INSTITUTION", "FAMILY_TO_CLASSROOM"]);
export type InvitationType = z.infer<typeof invitationTypeSchema>;

export const invitationStatusSchema = z.enum(["PENDING", "ACCEPTED", "REVOKED", "EXPIRED"]);
export type InvitationStatus = z.infer<typeof invitationStatusSchema>;

// ---------- Institutions ----------

export const createInstitutionDtoSchema = z.object({
  name: z.string().min(1),
  code: z.string().optional(),
  address: z.string().optional(),
});
export type CreateInstitutionDto = z.infer<typeof createInstitutionDtoSchema>;

export const institutionSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string().nullish(),
  address: z.string().nullish(),
  directorId: z.string(),
  createdAt: z.string(),
});
export type Institution = z.infer<typeof institutionSchema>;

// ---------- Courses ----------

export const createCourseDtoSchema = z.object({
  name: z.string().min(1),
  classroomId: z.string(),
});
export type CreateCourseDto = z.infer<typeof createCourseDtoSchema>;

export const courseSchema = z.object({
  id: z.string(),
  name: z.string(),
  classroomId: z.string(),
  createdAt: z.string(),
});
export type Course = z.infer<typeof courseSchema>;

// ---------- Enrollments ----------

export const enrollmentSchema = z.object({
  id: z.string(),
  classroomId: z.string(),
  studentId: z.string(),
  familiarId: z.string(),
  createdAt: z.string(),
});
export type Enrollment = z.infer<typeof enrollmentSchema>;

// ---------- Classrooms ----------

export const createClassroomDtoSchema = z.object({
  name: z.string().min(1),
  gradeLevel: z.string().min(1),
  institutionId: z.string().optional(),
});
export type CreateClassroomDto = z.infer<typeof createClassroomDtoSchema>;

export const updateClassroomDtoSchema = z.object({
  name: z.string().min(1).optional(),
  gradeLevel: z.string().min(1).optional(),
});
export type UpdateClassroomDto = z.infer<typeof updateClassroomDtoSchema>;

export const classroomSchema = z.object({
  id: z.string(),
  name: z.string(),
  gradeLevel: z.string(),
  institutionId: z.string().nullish(),
  teacherId: z.string(),
  createdAt: z.string(),
});
export type Classroom = z.infer<typeof classroomSchema>;

/**
 * GET /classrooms/:id — ClassroomService.findOne solo hace
 * `include: { courses: true }` (sin enrollments); GET /classrooms/:id/enrollments
 * es un endpoint aparte para eso.
 */
export const classroomDetailSchema = classroomSchema.extend({
  courses: z.array(courseSchema),
});
export type ClassroomDetail = z.infer<typeof classroomDetailSchema>;

/** GET /classrooms/:id/enrollments devuelve la matrícula con el estudiante embebido */
export const enrollmentWithStudentSchema = enrollmentSchema.extend({
  student: z.object({
    id: z.string(),
    fullName: z.string(),
    birthDate: z.string().nullish(),
  }),
});
export type EnrollmentWithStudent = z.infer<typeof enrollmentWithStudentSchema>;

// ---------- Grades ----------

export const createGradeDtoSchema = z.object({
  studentId: z.string(),
  courseId: z.string(),
  evaluation: z.string().min(1),
  score: z.number().min(0).max(20),
});
export type CreateGradeDto = z.infer<typeof createGradeDtoSchema>;

export const updateGradeDtoSchema = z.object({
  evaluation: z.string().min(1).optional(),
  score: z.number().min(0).max(20).optional(),
});
export type UpdateGradeDto = z.infer<typeof updateGradeDtoSchema>;

export const gradeSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  courseId: z.string(),
  course: courseSchema,
  evaluation: z.string(),
  score: z.number(),
  date: z.string(),
});
export type Grade = z.infer<typeof gradeSchema>;

// ---------- Competencies ----------

export const createCompetencyDtoSchema = z.object({
  name: z.string().min(1),
  area: z.string().min(1),
});
export type CreateCompetencyDto = z.infer<typeof createCompetencyDtoSchema>;

export const competencySchema = z.object({
  id: z.string(),
  name: z.string(),
  area: z.string(),
});
export type Competency = z.infer<typeof competencySchema>;

export const evaluateCompetencyDtoSchema = z.object({
  competencyId: z.string(),
  studentId: z.string(),
  courseId: z.string(),
  level: competencyLevelSchema,
});
export type EvaluateCompetencyDto = z.infer<typeof evaluateCompetencyDtoSchema>;

export const studentCompetencySchema = z.object({
  id: z.string(),
  studentId: z.string(),
  courseId: z.string(),
  competencyId: z.string(),
  competency: competencySchema,
  level: competencyLevelSchema,
  date: z.string(),
});
export type StudentCompetency = z.infer<typeof studentCompetencySchema>;

// ---------- Attendance ----------

export const createAttendanceDtoSchema = z.object({
  classroomId: z.string(),
  date: z.string(),
  records: z.array(
    z.object({
      studentId: z.string(),
      status: attendanceStatusSchema,
    })
  ),
});
export type CreateAttendanceDto = z.infer<typeof createAttendanceDtoSchema>;

export const updateAttendanceDtoSchema = z.object({ status: attendanceStatusSchema });
export type UpdateAttendanceDto = z.infer<typeof updateAttendanceDtoSchema>;

export const attendanceSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  classroomId: z.string(),
  date: z.string(),
  status: attendanceStatusSchema,
  createdAt: z.string(),
});
export type Attendance = z.infer<typeof attendanceSchema>;

// ---------- Support needs ----------

export const createSupportNeedDtoSchema = z.object({
  studentId: z.string(),
  type: supportNeedTypeSchema,
  level: supportLevelSchema.optional(),
  description: z.string().optional(),
});
export type CreateSupportNeedDto = z.infer<typeof createSupportNeedDtoSchema>;

export const updateSupportNeedDtoSchema = z.object({
  type: supportNeedTypeSchema.optional(),
  level: supportLevelSchema.optional(),
  description: z.string().optional(),
});
export type UpdateSupportNeedDto = z.infer<typeof updateSupportNeedDtoSchema>;

export const studentSupportNeedSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  type: supportNeedTypeSchema,
  level: supportLevelSchema,
  description: z.string().nullish(),
  registeredBy: z.string(),
  createdAt: z.string(),
});
export type StudentSupportNeed = z.infer<typeof studentSupportNeedSchema>;

// ---------- Students ----------

export const createStudentDtoSchema = z.object({
  fullName: z.string().min(1),
  birthDate: z.string().optional(),
  supportNeeds: z
    .array(
      z.object({
        type: supportNeedTypeSchema,
        level: supportLevelSchema.optional(),
        description: z.string().optional(),
      })
    )
    .optional(),
});
export type CreateStudentDto = z.infer<typeof createStudentDtoSchema>;

export const updateStudentDtoSchema = z.object({
  fullName: z.string().min(1).optional(),
  birthDate: z.string().optional(),
});
export type UpdateStudentDto = z.infer<typeof updateStudentDtoSchema>;

/**
 * StudentService (create/findOne/findAllByFamiliar/update) solo hace
 * `include: { supportNeeds: true }` — nunca incluye `enrollments`.
 */
export const studentSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  birthDate: z.string().nullish(),
  familiarId: z.string(),
  supportNeeds: z.array(studentSupportNeedSchema),
  createdAt: z.string(),
});
export type Student = z.infer<typeof studentSchema>;

// ---------- Invitations ----------

/**
 * No existe un POST /invitations genérico en el backend — hay dos rutas
 * separadas (`POST invitations/teacher`, `POST invitations/family`), sin
 * campo `type` en ninguno de los dos DTOs (el tipo lo determina la ruta).
 * Este schema combinado es solo para la UI; el servicio (`services/classroom.ts`)
 * lo traduce a la ruta correcta antes de enviarlo.
 */
export const createInvitationDtoSchema = z.object({
  email: z.string().email(),
  type: invitationTypeSchema,
  institutionId: z.string().optional(),
  classroomId: z.string().optional(),
});
export type CreateInvitationDto = z.infer<typeof createInvitationDtoSchema>;

export const invitationSchema = z.object({
  id: z.string(),
  token: z.string(),
  type: invitationTypeSchema,
  status: invitationStatusSchema,
  email: z.string(),
  institutionId: z.string().nullish(),
  classroomId: z.string().nullish(),
  createdBy: z.string(),
  usedBy: z.string().nullish(),
  usedAt: z.string().nullish(),
  expiresAt: z.string().nullish(),
  createdAt: z.string(),
});
export type Invitation = z.infer<typeof invitationSchema>;

export const acceptTeacherInvitationResponseSchema = z.object({ message: z.string() });
export type AcceptTeacherInvitationResponse = z.infer<
  typeof acceptTeacherInvitationResponseSchema
>;

export const acceptTeacherInvitationDtoSchema = z.object({ token: z.string() });
export type AcceptTeacherInvitationDto = z.infer<typeof acceptTeacherInvitationDtoSchema>;

export const acceptFamilyInvitationDtoSchema = z.object({
  token: z.string(),
  studentId: z.string(),
});
export type AcceptFamilyInvitationDto = z.infer<typeof acceptFamilyInvitationDtoSchema>;

export const institutionTeacherSchema = z.object({
  id: z.string(),
  institutionId: z.string(),
  teacherId: z.string(),
  joinedAt: z.string(),
});
export type InstitutionTeacher = z.infer<typeof institutionTeacherSchema>;

/** GET /institutions/:id devuelve la institución con sus aulas y docentes */
export const institutionDetailSchema = institutionSchema.extend({
  classrooms: z.array(classroomSchema),
  teachers: z.array(institutionTeacherSchema),
});
export type InstitutionDetail = z.infer<typeof institutionDetailSchema>;

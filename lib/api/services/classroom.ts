import { apiFetch } from "../http";
import { deletedResponseSchema } from "../schemas/common";
import {
  acceptTeacherInvitationResponseSchema,
  attendanceSchema,
  classroomDetailSchema,
  classroomSchema,
  competencySchema,
  courseSchema,
  enrollmentSchema,
  enrollmentWithStudentSchema,
  gradeSchema,
  institutionDetailSchema,
  institutionSchema,
  invitationSchema,
  studentCompetencySchema,
  studentSchema,
  studentSupportNeedSchema,
  type AcceptFamilyInvitationDto,
  type AcceptTeacherInvitationDto,
  type CreateAttendanceDto,
  type CreateClassroomDto,
  type CreateCompetencyDto,
  type CreateCourseDto,
  type CreateGradeDto,
  type CreateInstitutionDto,
  type CreateInvitationDto,
  type CreateStudentDto,
  type CreateSupportNeedDto,
  type EvaluateCompetencyDto,
  type UpdateAttendanceDto,
  type UpdateClassroomDto,
  type UpdateGradeDto,
  type UpdateStudentDto,
  type UpdateSupportNeedDto,
} from "../schemas/classroom";
import { z } from "zod";

const BASE = "/api/classroom";

// ---------- Institutions ----------

export const institutions = {
  create: (dto: CreateInstitutionDto, token: string) =>
    apiFetch(`${BASE}/institutions`, {
      method: "POST",
      body: dto,
      token,
      schema: institutionSchema,
    }),
  list: (token: string) =>
    apiFetch(`${BASE}/institutions`, { token, schema: z.array(institutionSchema) }),
  get: (id: string, token: string) =>
    apiFetch(`${BASE}/institutions/${id}`, { token, schema: institutionDetailSchema }),
  update: (id: string, dto: Partial<CreateInstitutionDto>, token: string) =>
    apiFetch(`${BASE}/institutions/${id}`, {
      method: "PATCH",
      body: dto,
      token,
      schema: institutionSchema,
    }),
  remove: (id: string, token: string) =>
    apiFetch(`${BASE}/institutions/${id}`, {
      method: "DELETE",
      token,
      schema: deletedResponseSchema,
    }),
};

// ---------- Classrooms ----------

export const classrooms = {
  create: (dto: CreateClassroomDto, token: string) =>
    apiFetch(`${BASE}/classrooms`, {
      method: "POST",
      body: dto,
      token,
      schema: classroomSchema,
    }),
  list: (token: string) =>
    apiFetch(`${BASE}/classrooms`, { token, schema: z.array(classroomSchema) }),
  get: (id: string, token: string) =>
    apiFetch(`${BASE}/classrooms/${id}`, { token, schema: classroomDetailSchema }),
  update: (id: string, dto: UpdateClassroomDto, token: string) =>
    apiFetch(`${BASE}/classrooms/${id}`, {
      method: "PATCH",
      body: dto,
      token,
      schema: classroomSchema,
    }),
  remove: (id: string, token: string) =>
    apiFetch(`${BASE}/classrooms/${id}`, {
      method: "DELETE",
      token,
      schema: deletedResponseSchema,
    }),
  enrollments: (id: string, token: string) =>
    apiFetch(`${BASE}/classrooms/${id}/enrollments`, {
      token,
      schema: z.array(enrollmentWithStudentSchema),
    }),
  removeEnrollment: (id: string, enrollmentId: string, token: string) =>
    apiFetch(`${BASE}/classrooms/${id}/enrollments/${enrollmentId}`, {
      method: "DELETE",
      token,
      schema: deletedResponseSchema,
    }),
};

// ---------- Courses ----------

export const courses = {
  create: (dto: CreateCourseDto, token: string) =>
    apiFetch(`${BASE}/courses`, { method: "POST", body: dto, token, schema: courseSchema }),
  list: (token: string) =>
    apiFetch(`${BASE}/courses`, { token, schema: z.array(courseSchema) }),
  get: (id: string, token: string) =>
    apiFetch(`${BASE}/courses/${id}`, {
      token,
      schema: courseSchema.extend({ classroom: classroomSchema }),
    }),
  update: (id: string, dto: { name?: string }, token: string) =>
    apiFetch(`${BASE}/courses/${id}`, {
      method: "PATCH",
      body: dto,
      token,
      schema: courseSchema,
    }),
  remove: (id: string, token: string) =>
    apiFetch(`${BASE}/courses/${id}`, {
      method: "DELETE",
      token,
      schema: deletedResponseSchema,
    }),
};

// ---------- Grades ----------

export const grades = {
  create: (dto: CreateGradeDto, token: string) =>
    apiFetch(`${BASE}/grades`, { method: "POST", body: dto, token, schema: gradeSchema }),
  byClassroom: (classroomId: string, token: string) =>
    apiFetch(`${BASE}/grades/classroom/${classroomId}`, {
      token,
      schema: z.array(gradeSchema),
    }),
  byStudent: (studentId: string, token: string) =>
    apiFetch(`${BASE}/grades/student/${studentId}`, {
      token,
      schema: z.array(gradeSchema),
    }),
  update: (id: string, dto: UpdateGradeDto, token: string) =>
    apiFetch(`${BASE}/grades/${id}`, {
      method: "PATCH",
      body: dto,
      token,
      schema: gradeSchema,
    }),
  remove: (id: string, token: string) =>
    apiFetch(`${BASE}/grades/${id}`, {
      method: "DELETE",
      token,
      schema: deletedResponseSchema,
    }),
};

// ---------- Competencies ----------

export const competencies = {
  create: (dto: CreateCompetencyDto, token: string) =>
    apiFetch(`${BASE}/competencies`, {
      method: "POST",
      body: dto,
      token,
      schema: competencySchema,
    }),
  list: (token: string) =>
    apiFetch(`${BASE}/competencies`, { token, schema: z.array(competencySchema) }),
  get: (id: string, token: string) =>
    apiFetch(`${BASE}/competencies/${id}`, { token, schema: competencySchema }),
  byStudent: (studentId: string, token: string) =>
    apiFetch(`${BASE}/competencies/student/${studentId}`, {
      token,
      schema: z.array(studentCompetencySchema),
    }),
  evaluate: (dto: EvaluateCompetencyDto, token: string) =>
    apiFetch(`${BASE}/competencies/evaluate`, {
      method: "POST",
      body: dto,
      token,
      schema: studentCompetencySchema,
    }),
};

// ---------- Attendance ----------

export const attendance = {
  create: (dto: CreateAttendanceDto, token: string) =>
    apiFetch(`${BASE}/attendance`, {
      method: "POST",
      body: dto,
      token,
      schema: z.array(attendanceSchema),
    }),
  update: (id: string, dto: UpdateAttendanceDto, token: string) =>
    apiFetch(`${BASE}/attendance/${id}`, {
      method: "PATCH",
      body: dto,
      token,
      schema: attendanceSchema,
    }),
  byClassroom: (classroomId: string, token: string) =>
    apiFetch(`${BASE}/attendance/classroom/${classroomId}`, {
      token,
      schema: z.array(attendanceSchema),
    }),
  byStudent: (studentId: string, token: string) =>
    apiFetch(`${BASE}/attendance/student/${studentId}`, {
      token,
      schema: z.array(attendanceSchema),
    }),
};

// ---------- Support needs ----------

export const supportNeeds = {
  create: (dto: CreateSupportNeedDto, token: string) =>
    apiFetch(`${BASE}/support-needs`, {
      method: "POST",
      body: dto,
      token,
      schema: studentSupportNeedSchema,
    }),
  byStudent: (studentId: string, token: string) =>
    apiFetch(`${BASE}/support-needs/student/${studentId}`, {
      token,
      schema: z.array(studentSupportNeedSchema),
    }),
  update: (id: string, dto: UpdateSupportNeedDto, token: string) =>
    apiFetch(`${BASE}/support-needs/${id}`, {
      method: "PATCH",
      body: dto,
      token,
      schema: studentSupportNeedSchema,
    }),
  remove: (id: string, token: string) =>
    apiFetch(`${BASE}/support-needs/${id}`, {
      method: "DELETE",
      token,
      schema: deletedResponseSchema,
    }),
};

// ---------- Students ----------

export const students = {
  create: (dto: CreateStudentDto, token: string) =>
    apiFetch(`${BASE}/students`, { method: "POST", body: dto, token, schema: studentSchema }),
  list: (token: string) =>
    apiFetch(`${BASE}/students`, { token, schema: z.array(studentSchema) }),
  get: (id: string, token: string) =>
    apiFetch(`${BASE}/students/${id}`, { token, schema: studentSchema }),
  update: (id: string, dto: UpdateStudentDto, token: string) =>
    apiFetch(`${BASE}/students/${id}`, {
      method: "PATCH",
      body: dto,
      token,
      schema: studentSchema,
    }),
  remove: (id: string, token: string) =>
    apiFetch(`${BASE}/students/${id}`, {
      method: "DELETE",
      token,
      schema: deletedResponseSchema,
    }),
};

// ---------- Invitations ----------

export const invitations = {
  /**
   * No existe POST /invitations en el backend — hay dos rutas separadas
   * (`invitations/teacher`, `invitations/family`) sin campo `type` en el
   * body (la ruta ya lo determina). Esta función traduce el DTO combinado
   * de la UI a la llamada real, según `dto.type`.
   */
  create: (dto: CreateInvitationDto, token: string) => {
    if (dto.type === "TEACHER_TO_INSTITUTION") {
      if (!dto.institutionId) throw new Error("institutionId es requerido para invitar a un docente");
      return apiFetch(`${BASE}/invitations/teacher`, {
        method: "POST",
        body: { email: dto.email, institutionId: dto.institutionId },
        token,
        schema: invitationSchema,
      });
    }
    if (!dto.classroomId) throw new Error("classroomId es requerido para invitar a una familia");
    return apiFetch(`${BASE}/invitations/family`, {
      method: "POST",
      body: { email: dto.email, classroomId: dto.classroomId },
      token,
      schema: invitationSchema,
    });
  },
  acceptTeacher: (dto: AcceptTeacherInvitationDto, token: string) =>
    apiFetch(`${BASE}/invitations/accept/teacher`, {
      method: "POST",
      body: dto,
      token,
      schema: acceptTeacherInvitationResponseSchema,
    }),
  acceptFamily: (dto: AcceptFamilyInvitationDto, token: string) =>
    apiFetch(`${BASE}/invitations/accept/family`, {
      method: "POST",
      body: dto,
      token,
      schema: enrollmentSchema,
    }),
  /** Público — no requiere JWT. Muestra el detalle antes de aceptar. */
  byToken: (token: string) =>
    apiFetch(`${BASE}/invitations/token/${token}`, { schema: invitationSchema }),
  list: (token: string) =>
    apiFetch(`${BASE}/invitations`, { token, schema: z.array(invitationSchema) }),
  revoke: (id: string, token: string) =>
    apiFetch(`${BASE}/invitations/${id}/revoke`, {
      method: "PATCH",
      token,
      schema: invitationSchema,
    }),
};

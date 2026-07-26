import { z } from "zod";

/**
 * Modelo `InstitutionReport` real (reports_db) — no tiene `title`/`type`/`csvFileId`;
 * solo se persisten reportes institucionales (los de aula/estudiante son PDF
 * on-demand sin guardar registro, ver ReportService.generateClassroomReport/
 * generateStudentReport en el backend).
 */
export const reportSchema = z.object({
  id: z.string(),
  gradeLevel: z.string().nullish(),
  courseId: z.string().nullish(),
  periodStart: z.string(),
  periodEnd: z.string(),
  classroomCount: z.number(),
  studentCount: z.number(),
  avgAttendanceRate: z.number(),
  avgGrade: z.number(),
  riskCounts: z.record(z.string(), z.number()),
  fileId: z.string().nullish(),
  pdfFileId: z.string().nullish(),
  generatedBy: z.string(),
  createdAt: z.string(),
});
export type Report = z.infer<typeof reportSchema>;

export const generateInstitutionalReportDtoSchema = z.object({
  gradeLevel: z.string().optional(),
  courseId: z.string().optional(),
  periodStart: z.string(),
  periodEnd: z.string(),
});
export type GenerateInstitutionalReportDto = z.infer<
  typeof generateInstitutionalReportDtoSchema
>;

export const generateClassroomReportDtoSchema = z.object({
  classroomId: z.string(),
  periodStart: z.string(),
  periodEnd: z.string(),
});
export type GenerateClassroomReportDto = z.infer<typeof generateClassroomReportDtoSchema>;

export const generateStudentReportDtoSchema = z.object({
  studentId: z.string(),
  classroomId: z.string(),
  periodStart: z.string(),
  periodEnd: z.string(),
});
export type GenerateStudentReportDto = z.infer<typeof generateStudentReportDtoSchema>;

/**
 * ReportService.generateReport devuelve { report, classroomSummaries, pdfBuffer }
 * (no { report, csvFileId, pdfFileId } — esos ids están en report.fileId/pdfFileId).
 * pdfBuffer no se declara aquí (es un Buffer, no tiene sentido consumirlo desde
 * el JSON de /generate; usar /generate/pdf con raw:true para el binario).
 */
export const generateReportResponseSchema = z.object({
  report: reportSchema,
  classroomSummaries: z.array(z.unknown()),
});
export type GenerateReportResponse = z.infer<typeof generateReportResponseSchema>;

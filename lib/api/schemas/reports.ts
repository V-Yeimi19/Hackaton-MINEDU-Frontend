import { z } from "zod";

export const reportTypeSchema = z.enum(["INSTITUTIONAL", "CLASSROOM", "STUDENT"]);
export type ReportType = z.infer<typeof reportTypeSchema>;

export const reportSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: reportTypeSchema,
  gradeLevel: z.string().optional(),
  csvFileId: z.string().optional(),
  pdfFileId: z.string().optional(),
  generatedBy: z.string(),
  periodStart: z.string(),
  periodEnd: z.string(),
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

export const generateReportResponseSchema = z.object({
  report: reportSchema,
  csvFileId: z.string(),
  pdfFileId: z.string(),
});
export type GenerateReportResponse = z.infer<typeof generateReportResponseSchema>;

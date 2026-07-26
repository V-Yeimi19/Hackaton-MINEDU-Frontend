import { z } from "zod";

export const generateAiReportDtoSchema = z.object({
  classroomId: z.string(),
  weekStart: z.string(),
  weekEnd: z.string(),
});
export type GenerateAiReportDto = z.infer<typeof generateAiReportDtoSchema>;

/**
 * Modelo `Report` real (ai_db) — no tiene `title`/`periodStart`/`periodEnd`/`fileId`,
 * ni persiste attendanceSummary/gradeSummary/anomalies (esos son efímeros, solo
 * viajan en la respuesta de POST /reports/generate, ver generateAiReportResponseSchema).
 */
export const aiReportSchema = z.object({
  id: z.string(),
  classroomId: z.string(),
  courseId: z.string(),
  teacherId: z.string(),
  courseName: z.string(),
  className: z.string(),
  weekStart: z.string(),
  weekEnd: z.string(),
  studentCount: z.number(),
  pdfFileId: z.string().nullish(),
  status: z.string(),
  createdAt: z.string(),
});
export type AiReport = z.infer<typeof aiReportSchema>;

export const aiAnomalySchema = z.object({
  studentId: z.string(),
  message: z.string(),
});
export type AiAnomaly = z.infer<typeof aiAnomalySchema>;

export const generateAiReportResponseSchema = z.object({
  report: aiReportSchema,
  attendanceSummary: z.record(z.string(), z.unknown()),
  gradeSummary: z.record(z.string(), z.unknown()),
  anomalies: z.array(aiAnomalySchema),
});
export type GenerateAiReportResponse = z.infer<typeof generateAiReportResponseSchema>;

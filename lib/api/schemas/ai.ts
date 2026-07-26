import { z } from "zod";

export const generateAiReportDtoSchema = z.object({
  classroomId: z.string(),
  weekStart: z.string(),
  weekEnd: z.string(),
});
export type GenerateAiReportDto = z.infer<typeof generateAiReportDtoSchema>;

export const aiReportSchema = z.object({
  id: z.string(),
  classroomId: z.string(),
  title: z.string(),
  periodStart: z.string(),
  periodEnd: z.string(),
  fileId: z.string().optional(),
  attendanceSummary: z.record(z.string(), z.unknown()),
  gradeSummary: z.record(z.string(), z.unknown()),
  anomalies: z.array(z.string()),
  createdAt: z.string(),
});
export type AiReport = z.infer<typeof aiReportSchema>;

export const generateAiReportResponseSchema = z.object({
  report: aiReportSchema,
  attendanceSummary: z.record(z.string(), z.unknown()),
  gradeSummary: z.record(z.string(), z.unknown()),
  anomalies: z.array(z.string()),
});
export type GenerateAiReportResponse = z.infer<typeof generateAiReportResponseSchema>;

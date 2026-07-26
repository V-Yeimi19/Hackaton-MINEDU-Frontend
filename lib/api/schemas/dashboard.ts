import { z } from "zod";

export const riskCountsSchema = z.record(z.string(), z.number());
export type RiskCounts = z.infer<typeof riskCountsSchema>;

export const nationalSummarySchema = z.object({
  totalStudents: z.number(),
  activeInstitutions: z.number(),
  totalClassrooms: z.number(),
  riskCounts: riskCountsSchema,
  calculatedAt: z.string(),
});
export type NationalSummary = z.infer<typeof nationalSummarySchema>;

export const institutionSummarySchema = z.object({
  institutionId: z.string(),
  classroomCount: z.number(),
  studentCount: z.number(),
  avgAttendanceRate: z.number(),
  avgGrade: z.number(),
  riskCounts: riskCountsSchema,
  calculatedAt: z.string(),
});
export type InstitutionSummary = z.infer<typeof institutionSummarySchema>;

export const trendScopeSchema = z.enum(["NATIONAL", "INSTITUTION"]);
export type TrendScope = z.infer<typeof trendScopeSchema>;

export const trendMetricSchema = z.enum([
  "avgAttendanceRate",
  "avgGrade",
  "totalStudents",
  "activeInstitutions",
]);
export type TrendMetric = z.infer<typeof trendMetricSchema>;

export const metricSnapshotSchema = z.object({
  id: z.string(),
  scope: trendScopeSchema,
  scopeId: z.string().nullable(),
  metric: z.string(),
  value: z.number(),
  capturedAt: z.string(),
});
export type MetricSnapshot = z.infer<typeof metricSnapshotSchema>;

export const courseProgressSchema = z.object({
  courseId: z.string(),
  totalUnits: z.number(),
  completedUnits: z.number(),
  percentage: z.number(),
});
export type CourseProgress = z.infer<typeof courseProgressSchema>;

export const classroomProgressSchema = z.object({
  classroomId: z.string(),
  courseCount: z.number(),
  totalUnits: z.number(),
  completedUnits: z.number(),
  percentage: z.number(),
});
export type ClassroomProgress = z.infer<typeof classroomProgressSchema>;

export const incidentSeveritySchema = z.enum(["LEVE", "MODERADO", "GRAVE"]);
export type IncidentSeverity = z.infer<typeof incidentSeveritySchema>;

export const studentIncidentSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  type: z.string(),
  description: z.string().nullish(),
  severity: incidentSeveritySchema,
  registeredBy: z.string(),
  createdAt: z.string(),
});
export type StudentIncident = z.infer<typeof studentIncidentSchema>;

export const studentExtrasSchema = z.object({
  studentId: z.string(),
  creditsEarned: z.number(),
  incidents: z.array(studentIncidentSchema),
});
export type StudentExtras = z.infer<typeof studentExtrasSchema>;

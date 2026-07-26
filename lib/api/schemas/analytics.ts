import { z } from "zod";

export const studentIndicatorSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  classroomId: z.string(),
  attendanceRate: z.number(),
  avgGrade: z.number(),
  gradeCount: z.number(),
  competencyScore: z.number(),
  competencyCount: z.number(),
  lastCalculatedAt: z.string(),
});
export type StudentIndicator = z.infer<typeof studentIndicatorSchema>;

export const riskLevelSchema = z.enum(["BAJO", "MEDIO", "ALTO", "CRITICO"]);
export type RiskLevel = z.infer<typeof riskLevelSchema>;

export const studentTwinSnapshotSchema = z.object({
  studentId: z.string(),
  attendanceRate: z.number(),
  avgGrade: z.number(),
  participationScore: z.number(),
  competencyScore: z.number(),
  riskLevel: riskLevelSchema,
  riskReasons: z.array(z.string()),
  recommendations: z.array(z.string()),
  lastUpdated: z.string(),
});
export type StudentTwinSnapshot = z.infer<typeof studentTwinSnapshotSchema>;

export const classroomTwinResponseSchema = z.object({
  classroomId: z.string(),
  studentsCount: z.number(),
  atRiskCount: z.number(),
  students: z.array(studentTwinSnapshotSchema),
});
export type ClassroomTwinResponse = z.infer<typeof classroomTwinResponseSchema>;

export const recommendationStatusSchema = z.enum(["ACTIVE", "DISMISSED"]);
export type RecommendationStatus = z.infer<typeof recommendationStatusSchema>;

export const recommendationSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  classroomId: z.string(),
  type: z.string(),
  message: z.string(),
  source: z.string(),
  status: recommendationStatusSchema,
  createdAt: z.string(),
});
export type Recommendation = z.infer<typeof recommendationSchema>;

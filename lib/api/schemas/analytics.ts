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
  updatedAt: z.string(),
});
export type StudentIndicator = z.infer<typeof studentIndicatorSchema>;

// Prisma RiskLevel (analytics_db): NONE | LOW | MEDIUM | HIGH — no son los valores en español.
export const riskLevelSchema = z.enum(["NONE", "LOW", "MEDIUM", "HIGH"]);
export type RiskLevel = z.infer<typeof riskLevelSchema>;

// Prisma RecommendationStatus (analytics_db): PENDING | SENT | DISMISSED.
export const recommendationStatusSchema = z.enum(["PENDING", "SENT", "DISMISSED"]);
export type RecommendationStatus = z.infer<typeof recommendationStatusSchema>;

export const twinRecommendationSchema = z.object({
  id: z.string(),
  type: z.string(),
  message: z.string(),
  source: z.string(),
  status: recommendationStatusSchema,
});
export type TwinRecommendation = z.infer<typeof twinRecommendationSchema>;

export const studentTwinSnapshotSchema = z.object({
  studentId: z.string(),
  attendanceRate: z.number(),
  avgGrade: z.number(),
  participationScore: z.number(),
  competencyScore: z.number(),
  riskLevel: riskLevelSchema,
  riskReasons: z.array(z.string()),
  recommendations: z.array(twinRecommendationSchema),
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

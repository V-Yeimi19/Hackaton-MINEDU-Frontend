import { apiFetch } from "../http";
import {
  classroomProgressSchema,
  courseProgressSchema,
  institutionSummarySchema,
  metricSnapshotSchema,
  nationalSummarySchema,
  studentExtrasSchema,
  studentIncidentSchema,
  type IncidentSeverity,
  type TrendMetric,
  type TrendScope,
} from "../schemas/dashboard";
import { z } from "zod";

const BASE = "/api/dashboard";

export const summary = {
  national: (token: string) =>
    apiFetch(`${BASE}/national-summary`, { token, schema: nationalSummarySchema }),
  institution: (institutionId: string, token: string) =>
    apiFetch(`${BASE}/institution/${institutionId}/summary`, {
      token,
      schema: institutionSummarySchema,
    }),
};

export const trends = {
  get: (
    query: { scope: TrendScope; scopeId?: string; metric: TrendMetric; months?: number },
    token: string
  ) =>
    apiFetch(`${BASE}/trends`, {
      token,
      query,
      schema: z.array(metricSnapshotSchema),
    }),
};

export const progress = {
  byCourse: (courseId: string, token: string) =>
    apiFetch(`${BASE}/course/${courseId}/progress`, { token, schema: courseProgressSchema }),
  updateCourse: (
    courseId: string,
    dto: { totalUnits: number; completedUnits: number },
    token: string
  ) =>
    apiFetch(`${BASE}/course/${courseId}/progress`, {
      method: "PATCH",
      token,
      body: dto,
      schema: courseProgressSchema,
    }),
  byClassroom: (classroomId: string, token: string) =>
    apiFetch(`${BASE}/classroom/${classroomId}/progress`, {
      token,
      schema: classroomProgressSchema,
    }),
};

export const studentExtras = {
  get: (studentId: string, token: string) =>
    apiFetch(`${BASE}/student/${studentId}/extras`, { token, schema: studentExtrasSchema }),
  createIncident: (
    studentId: string,
    dto: { type: string; description?: string; severity?: IncidentSeverity },
    token: string
  ) =>
    apiFetch(`${BASE}/student/${studentId}/incidents`, {
      method: "POST",
      token,
      body: dto,
      schema: studentIncidentSchema,
    }),
};

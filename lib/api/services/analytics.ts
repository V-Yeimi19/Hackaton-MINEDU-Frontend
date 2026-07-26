import { apiFetch } from "../http";
import { paginated } from "../schemas/common";
import {
  classroomTwinResponseSchema,
  recommendationSchema,
  studentIndicatorSchema,
  studentTwinSnapshotSchema,
} from "../schemas/analytics";

const BASE = "/api/analytics";

export const indicators = {
  byClassroom: (
    classroomId: string,
    token: string,
    query?: { page?: number; limit?: number }
  ) =>
    apiFetch(`${BASE}/indicators/classroom/${classroomId}`, {
      token,
      query,
      schema: paginated(studentIndicatorSchema),
    }),
  byStudentInClassroom: (studentId: string, classroomId: string, token: string) =>
    apiFetch(`${BASE}/indicators/student/${studentId}/classroom/${classroomId}`, {
      token,
      schema: studentIndicatorSchema,
    }),
  byStudent: (studentId: string, token: string, query?: { page?: number; limit?: number }) =>
    apiFetch(`${BASE}/indicators/student/${studentId}`, {
      token,
      query,
      schema: paginated(studentIndicatorSchema),
    }),
};

export const digitalTwin = {
  byClassroom: (classroomId: string, token: string) =>
    apiFetch(`${BASE}/digital-twin/classroom/${classroomId}`, {
      token,
      schema: classroomTwinResponseSchema,
    }),
  byStudentInClassroom: (classroomId: string, studentId: string, token: string) =>
    apiFetch(`${BASE}/digital-twin/classroom/${classroomId}/student/${studentId}`, {
      token,
      schema: studentTwinSnapshotSchema,
    }),
};

export const recommendations = {
  byClassroom: (
    classroomId: string,
    token: string,
    query?: { page?: number; limit?: number }
  ) =>
    apiFetch(`${BASE}/recommendations/classroom/${classroomId}`, {
      token,
      query,
      schema: paginated(recommendationSchema),
    }),
  byStudent: (studentId: string, token: string, query?: { page?: number; limit?: number }) =>
    apiFetch(`${BASE}/recommendations/student/${studentId}`, {
      token,
      query,
      schema: paginated(recommendationSchema),
    }),
  dismiss: (id: string, token: string) =>
    apiFetch(`${BASE}/recommendations/${id}/dismiss`, {
      method: "PATCH",
      token,
      schema: recommendationSchema,
    }),
};

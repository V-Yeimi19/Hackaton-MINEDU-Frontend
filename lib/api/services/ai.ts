import { apiFetch } from "../http";
import {
  aiReportSchema,
  generateAiReportResponseSchema,
  type GenerateAiReportDto,
} from "../schemas/ai";
import { z } from "zod";

const BASE = "/api/ai";

export function generateWeeklyReport(dto: GenerateAiReportDto, token: string) {
  return apiFetch(`${BASE}/reports/generate`, {
    method: "POST",
    body: dto,
    token,
    schema: generateAiReportResponseSchema,
  });
}

export function generateWeeklyReportPdf(dto: GenerateAiReportDto, token: string) {
  return apiFetch<Response>(`${BASE}/reports/generate/pdf`, {
    method: "POST",
    body: dto,
    token,
    raw: true,
  });
}

export function listWeeklyReports(
  token: string,
  query?: { classroomId?: string; courseId?: string }
) {
  return apiFetch(`${BASE}/reports`, { token, query, schema: z.array(aiReportSchema) });
}

export function getWeeklyReport(id: string, token: string) {
  return apiFetch(`${BASE}/reports/${id}`, { token, schema: aiReportSchema });
}

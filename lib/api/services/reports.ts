import { apiFetch } from "../http";
import {
  generateReportResponseSchema,
  reportSchema,
  type GenerateClassroomReportDto,
  type GenerateInstitutionalReportDto,
  type GenerateStudentReportDto,
} from "../schemas/reports";
import { z } from "zod";

const BASE = "/api/reports";

export function generateInstitutionalReport(
  dto: GenerateInstitutionalReportDto,
  token: string
) {
  return apiFetch(`${BASE}/generate`, {
    method: "POST",
    body: dto,
    token,
    schema: generateReportResponseSchema,
  });
}

/** Devuelve el binario PDF directamente (Response cruda, no JSON). */
export function generateInstitutionalReportPdf(
  dto: GenerateInstitutionalReportDto,
  token: string
) {
  return apiFetch<Response>(`${BASE}/generate/pdf`, {
    method: "POST",
    body: dto,
    token,
    raw: true,
  });
}

export function generateClassroomReportPdf(dto: GenerateClassroomReportDto, token: string) {
  return apiFetch<Response>(`${BASE}/generate/classroom`, {
    method: "POST",
    body: dto,
    token,
    raw: true,
  });
}

export function generateStudentReportPdf(dto: GenerateStudentReportDto, token: string) {
  return apiFetch<Response>(`${BASE}/generate/student`, {
    method: "POST",
    body: dto,
    token,
    raw: true,
  });
}

export function listReports(
  token: string,
  query?: { gradeLevel?: string; courseId?: string }
) {
  return apiFetch(BASE, { token, query, schema: z.array(reportSchema) });
}

export function getReport(id: string, token: string) {
  return apiFetch(`${BASE}/${id}`, { token, schema: reportSchema });
}

export function downloadReportUrl(id: string): string {
  return `${BASE}/${id}/download`;
}

export function downloadReportPdfUrl(id: string): string {
  return `${BASE}/${id}/download/pdf`;
}

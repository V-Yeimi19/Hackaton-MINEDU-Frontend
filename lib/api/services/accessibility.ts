import { apiFetch } from "../http";
import {
  accessibilityJobSchema,
  generateWorksheetResponseSchema,
  processContentResponseSchema,
  type GenerateWorksheetDto,
  type ProcessContentDto,
} from "../schemas/accessibility";
import { z } from "zod";

const BASE = "/api/accessibility";

export function processContent(dto: ProcessContentDto, token: string) {
  return apiFetch(`${BASE}/process`, {
    method: "POST",
    body: dto,
    token,
    schema: processContentResponseSchema,
  });
}

export function processContentAudio(dto: ProcessContentDto, token: string) {
  return apiFetch<Response>(`${BASE}/process/audio`, {
    method: "POST",
    body: dto,
    token,
    raw: true,
  });
}

export function generateWorksheet(dto: GenerateWorksheetDto, token: string) {
  return apiFetch(`${BASE}/process/worksheet`, {
    method: "POST",
    body: dto,
    token,
    schema: generateWorksheetResponseSchema,
  });
}

export function listJobs(token: string) {
  return apiFetch(`${BASE}/jobs`, { token, schema: z.array(accessibilityJobSchema) });
}

export function getJob(id: string, token: string) {
  return apiFetch(`${BASE}/jobs/${id}`, { token, schema: accessibilityJobSchema });
}

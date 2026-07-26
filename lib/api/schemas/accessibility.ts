import { z } from "zod";
import { supportLevelSchema } from "./classroom";

export const processContentDtoSchema = z.object({
  fileId: z.string(),
  fileName: z.string(),
  fileType: z.string(),
  adaptationLevel: supportLevelSchema,
});
export type ProcessContentDto = z.infer<typeof processContentDtoSchema>;

export const generateWorksheetDtoSchema = processContentDtoSchema.extend({
  studentId: z.string().optional(),
});
export type GenerateWorksheetDto = z.infer<typeof generateWorksheetDtoSchema>;

export const accessibilityJobStatusSchema = z.enum([
  "PENDING",
  "PROCESSING",
  "COMPLETED",
  "FAILED",
]);
export type AccessibilityJobStatus = z.infer<typeof accessibilityJobStatusSchema>;

export const accessibilityJobSchema = z.object({
  id: z.string(),
  fileId: z.string(),
  fileName: z.string(),
  fileType: z.string(),
  status: accessibilityJobStatusSchema,
  originalText: z.string().optional(),
  adaptedText: z.string().optional(),
  summaryText: z.string().optional(),
  audioFileId: z.string().optional(),
  subtitlesFileId: z.string().optional(),
  pictogramData: z.record(z.string(), z.unknown()).optional(),
  adaptationLevel: supportLevelSchema,
  worksheetFileId: z.string().optional(),
  worksheetContent: z.record(z.string(), z.unknown()).optional(),
  error: z.string().optional(),
  createdAt: z.string(),
});
export type AccessibilityJob = z.infer<typeof accessibilityJobSchema>;

export const processContentResponseSchema = z.object({
  job: accessibilityJobSchema,
  audioSize: z.number(),
});
export type ProcessContentResponse = z.infer<typeof processContentResponseSchema>;

export const generateWorksheetResponseSchema = z.object({
  job: accessibilityJobSchema,
  worksheetSize: z.number(),
});
export type GenerateWorksheetResponse = z.infer<typeof generateWorksheetResponseSchema>;

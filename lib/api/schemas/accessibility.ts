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

export const pictogramEntrySchema = z.object({
  keyword: z.string(),
  arasaacId: z.number(),
  imageUrl: z.string(),
});
export type PictogramEntry = z.infer<typeof pictogramEntrySchema>;

export const worksheetExerciseSchema = z.object({
  type: z.enum(["opcion_multiple", "verdadero_falso", "completar", "texto"]),
  prompt: z.string(),
  options: z.array(z.string()).optional(),
  answer: z.string().optional(),
});

export const worksheetContentSchema = z.object({
  title: z.string(),
  instructions: z.string(),
  exercises: z.array(worksheetExerciseSchema),
});

export const accessibilityJobSchema = z.object({
  id: z.string(),
  fileId: z.string(),
  fileName: z.string(),
  fileType: z.string(),
  status: accessibilityJobStatusSchema,
  originalText: z.string().nullish(),
  adaptedText: z.string().nullish(),
  summaryText: z.string().nullish(),
  audioFileId: z.string().nullish(),
  subtitlesFileId: z.string().nullish(),
  // AccessibilityJob.pictogramData es un ARRAY de {keyword, arasaacId, imageUrl},
  // no un objeto/record — PictogramService.fetchPictograms devuelve PictogramEntry[].
  pictogramData: z.array(pictogramEntrySchema).nullish(),
  adaptationLevel: supportLevelSchema,
  worksheetFileId: z.string().nullish(),
  worksheetContent: worksheetContentSchema.nullish(),
  error: z.string().nullish(),
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

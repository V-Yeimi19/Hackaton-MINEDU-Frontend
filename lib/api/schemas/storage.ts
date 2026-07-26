import { z } from "zod";

export const fileSchema = z.object({
  id: z.string(),
  key: z.string(),
  originalName: z.string(),
  mimeType: z.string(),
  size: z.number(),
  ownerId: z.string(),
  createdAt: z.string(),
});
export type ApiFile = z.infer<typeof fileSchema>;

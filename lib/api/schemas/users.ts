import { z } from "zod";
import { roleSchema } from "./common";

export const userSchema = z.object({
  id: z.string(),
  authUserId: z.string(),
  email: z.string().email(),
  fullName: z.string(),
  role: roleSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type User = z.infer<typeof userSchema>;

export const updateUserDtoSchema = z.object({
  fullName: z.string().min(1).optional(),
});
export type UpdateUserDto = z.infer<typeof updateUserDtoSchema>;

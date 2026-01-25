import { z } from "zod";

import { userRoleEnum } from "@/lib/db/schema";

const passwordRules = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(128, "Password must be at most 128 characters long");

export const registerSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: passwordRules,
  name: z.string().min(1).max(120).optional(),
  role: z.enum(userRoleEnum.enumValues).optional()
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required")
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

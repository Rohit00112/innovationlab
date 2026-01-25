import { z } from "zod";

import { userRoleEnum, userStatusEnum } from "@/lib/db/schema";

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  name: z.string().max(120).optional().nullable(),
  avatarUrl: z.string().url().max(2048).optional().nullable(),
  role: z.enum(userRoleEnum.enumValues).optional(),
  status: z.enum(userStatusEnum.enumValues).optional()
});

export const updateUserSchema = z
  .object({
    email: z.string().email().optional(),
    password: z.string().min(8).max(128).optional(),
    name: z.string().max(120).optional().nullable(),
    avatarUrl: z.string().url().max(2048).optional().nullable(),
    role: z.enum(userRoleEnum.enumValues).optional(),
    status: z.enum(userStatusEnum.enumValues).optional(),
    revokeSessions: z.boolean().optional()
  })
  .refine(
    value => (value.email ? value.email.length > 0 : true),
    "Email cannot be empty"
  );

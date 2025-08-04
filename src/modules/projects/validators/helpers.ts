import { ENVIRONMENTS, PROJECT_STATUSES } from "@/constants/enums";
import { requiredSchema } from "@/validators/shared/required.validator";
import { z } from "zod";

export const objectIdRegex = /^[a-f\d]{24}$/i;

export const permissionsSchema = z
  .object({
    canEditProject: z.boolean().optional(),
    canEditCredentials: z.boolean().optional(),
    canDeleteProject: z.boolean().optional(),
  })
  .optional();

export const credentialProjectInputSchema = z.object({
  name: requiredSchema,
  url: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  notes: z.string().optional(),
  environment: z.enum(ENVIRONMENTS),
  owner: z.string().optional(),
});

export const projectInputSchema = z.object({
  name: requiredSchema,
  status: z.enum(PROJECT_STATUSES).optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  notes: z.array(z.string()).optional(),
  deadline: z.coerce.date().optional(),
  credentials: z.array(credentialProjectInputSchema).optional(),
  members: z
    .array(
      z.object({
        userId: z.string(),
        position: z.string().optional(),
        permissions: permissionsSchema,
      })
    )
    .optional(),
});

import { z } from "zod";

export const objectIdRegex = /^[a-f\d]{24}$/i;

export const permissionsSchema = z
  .object({
    canEditProject: z.boolean().optional(),
    canEditCredentials: z.boolean().optional(),
    canDeleteProject: z.boolean().optional(),
  })
  .optional();

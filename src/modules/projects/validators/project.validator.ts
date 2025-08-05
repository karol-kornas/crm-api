import { z } from "zod";
import { permissionsSchema } from "./helpers";
import { requiredSchema } from "@/validators/shared/required.validator";
import { PROJECT_STATUSES } from "@/constants/enums";
import { projectCredentialInputSchema } from "./credential.validator";

export const projectInputSchema = z.object({
  name: requiredSchema,
  status: z.enum(PROJECT_STATUSES).optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  notes: z.array(z.string()).optional(),
  deadline: z.coerce.date().optional(),
  credentials: z.array(projectCredentialInputSchema).optional(),
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

export const projectInputUpdateSchema = projectInputSchema
  .omit({ credentials: true, members: true })
  .partial();

export const projectSchema = z.object({
  projectData: projectInputSchema,
});

export const projectUpdateSchema = z.object({
  projectData: projectInputUpdateSchema,
});

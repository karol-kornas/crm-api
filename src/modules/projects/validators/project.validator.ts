import { z } from "zod";
import { requiredSchema } from "@/validators/shared/required.validator";
import { PROJECT_STATUSES } from "@/constants/enums";
import { credentialProjectSchema } from "@/validators/shared/credential-project.validator";

export const projectSchema = z.object({
  name: requiredSchema,
  status: z.enum(PROJECT_STATUSES).optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  notes: z.array(z.string()).optional(),
  deadline: z.coerce.date().optional(),
  credentials: z.array(credentialProjectSchema).optional(),
  members: z
    .array(
      z.object({
        userId: z.string(),
        position: z.string().optional(),
        permissions: z
          .object({
            canEditProject: z.boolean().optional(),
            canEditCredentials: z.boolean().optional(),
            canDeleteProject: z.boolean().optional(),
          })
          .optional(),
      })
    )
    .optional(),
});

const objectIdRegex = /^[a-f\d]{24}$/i;

const permissionsSchema = z.object({
  canEditProject: z.boolean().optional(),
  canEditCredentials: z.boolean().optional(),
});

const memberSchema = z.object({
  userId: requiredSchema.regex(objectIdRegex, "Invalid userId"),
  position: z.string().optional(),
  permissions: permissionsSchema.optional(),
});

export const projectMembersSchema = z.object({
  members: z.array(memberSchema).min(1, "At least one member is required"),
});

export const projectMembersRemoveSchema = z.object({
  userIds: z.array(z.string()).min(1, "At least one userId is required"),
});

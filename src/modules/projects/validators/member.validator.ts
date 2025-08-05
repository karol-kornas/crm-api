import { z } from "zod";
import { requiredSchema } from "@/validators/shared/required.validator";
import { objectIdRegex, permissionsSchema } from "./helpers";

export const projectMemberInputSchema = z.object({
  userId: requiredSchema.regex(objectIdRegex, "Invalid userId"),
  position: z.string().optional(),
  permissions: permissionsSchema,
});

export const projectMembersSchema = z.object({
  members: z.array(projectMemberInputSchema).min(1, "At least one member is required"),
});

export const projectMembersRemoveSchema = z.object({
  userIds: z.array(z.string()).min(1, "At least one userId is required"),
});

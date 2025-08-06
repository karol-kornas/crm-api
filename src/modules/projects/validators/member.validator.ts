import { z } from "zod";
import { permissionsSchema } from "./helpers";
import { objectIdSchema } from "@/validators/shared/object-id.validator";

export const projectMemberInputSchema = z.object({
  userId: objectIdSchema,
  position: z.string().optional(),
  permissions: permissionsSchema,
});

export const projectMembersSchema = z.object({
  members: z.array(projectMemberInputSchema).min(1, "At least one member is required"),
});

export const projectMembersRemoveSchema = z.object({
  userIds: z.array(z.string()).min(1, "At least one userId is required"),
});

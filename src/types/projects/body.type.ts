import { z } from "zod";
import { projectSchema, projectUpdateSchema } from "@/modules/projects/validators/project.validator";
import {
  projectMembersRemoveSchema,
  projectMembersSchema,
} from "@/modules/projects/validators/member.validator";
import {
  projectCredentialSchema,
  projectCredentialUpdateSchema,
} from "@/modules/projects/validators/credential.validator";

export type ProjectBody = z.infer<typeof projectSchema>;

export type ProjectUpdateBody = z.infer<typeof projectUpdateSchema>;

export type ProjectMembersBody = z.infer<typeof projectMembersSchema>;

export type RemoveProjectMembersBody = z.infer<typeof projectMembersRemoveSchema>;

export type ProjectCredentialBody = z.infer<typeof projectCredentialSchema>;

export type ProjectCredentialUpdateBody = z.infer<typeof projectCredentialUpdateSchema>;

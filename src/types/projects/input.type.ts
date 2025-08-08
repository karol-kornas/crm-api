import { z } from "zod";
import { projectMemberInputSchema } from "@/modules/projects/validators/member.validator";
import {
  projectInputSchema,
  projectInputUpdateSchema,
} from "@/modules/projects/validators/project.validator";
import { projectCredentialInputSchema } from "@/modules/projects/validators/credential.validator";

export type ProjectInput = z.infer<typeof projectInputSchema>;

export type ProjectUpdateInput = z.infer<typeof projectInputUpdateSchema>;

export type ProjectMemberInput = z.infer<typeof projectMemberInputSchema>;

export type ProjectCredentialInput = z.infer<typeof projectCredentialInputSchema>;

import { ENVIRONMENTS } from "@/constants/enums";
import { requiredSchema } from "@/validators/shared/required.validator";
import { z } from "zod";

export const projectCredentialInputSchema = z.object({
  name: requiredSchema,
  url: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  notes: z.string().optional(),
  environment: z.enum(ENVIRONMENTS),
  owner: z.string().optional(),
});

export const projectCredentialSchema = z.object({
  credentialData: projectCredentialInputSchema,
});

export const projectCredentialUpdateSchema = z.object({
  credentialData: projectCredentialInputSchema.partial(),
});

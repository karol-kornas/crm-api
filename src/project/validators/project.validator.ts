import { z } from "zod";
import { requiredSchema } from "@/validators/shared/required.validator";
import { PROJECT_STATUSES } from "@/constants/enums";
import { credentialProjectSchema } from "@/validators/shared/credentialProject.validator";

export const projectSchema = z.object({
  name: requiredSchema,
  status: z.enum(PROJECT_STATUSES).optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  notes: z.array(z.string()).optional(),
  deadline: z.coerce.date().optional(),
  credentials: z.array(credentialProjectSchema).optional(),
});

import { z } from "zod";
import { requiredSchema } from "./required.validator";
import { ENVIRONMENTS } from "@/constants/enums";

export const credentialProjectSchema = z.object({
  name: requiredSchema,
  url: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  notes: z.string().optional(),
  environment: z.enum(ENVIRONMENTS).optional(),
  owner: z.string().optional(),
});

import { z } from "zod";
import { credentialProjectInputSchema } from "./helpers";

export const credentialProjectSchema = z.object({
  credentialData: credentialProjectInputSchema,
});

export const credentialProjectUpdateSchema = z.object({
  credentialData: credentialProjectInputSchema.partial(),
});

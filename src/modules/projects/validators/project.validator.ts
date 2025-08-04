import { z } from "zod";
import { projectInputSchema } from "./helpers";

export const projectSchema = z.object({
  projectData: projectInputSchema,
});

export const projectUpdateSchema = z.object({
  projectData: projectInputSchema.optional(),
});

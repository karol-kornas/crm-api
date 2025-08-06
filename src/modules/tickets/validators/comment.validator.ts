import { requiredSchema } from "@/validators/shared/required.validator";
import { z } from "zod";

export const commentInputSchema = z.object({
    text: requiredSchema,
})

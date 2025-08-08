import { requiredSchema } from "@/validators/shared/required.validator";
import { z } from "zod";

export const ticketCommentInputSchema = z.object({
  text: requiredSchema,
});

export const ticketCommentSchema = z.object({
  commentData: ticketCommentInputSchema,
});

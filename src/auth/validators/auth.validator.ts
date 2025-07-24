import { z } from "zod";
import { passwordSchema } from "@/validators/shared/password.validator";
import { emailSchema } from "@/validators/shared/email.validator";
import { requiredSchema } from "@/validators/shared/required.validator";

export const registerSchema = z.object({
  first_name: requiredSchema,
  last_name: requiredSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: requiredSchema,
});

import { z } from "zod";
import { passwordSchema } from "@/validators/shared/password.validator";
import { emailSchema } from "@/validators/shared/email.validator";
import { requiredSchema } from "@/validators/shared/required.validator";

export const registerInputSchema = z.object({
  first_name: requiredSchema,
  last_name: requiredSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = z.object({
  userData: registerInputSchema,
});

export const loginInputSchema = z.object({
  email: emailSchema,
  password: requiredSchema,
});

export const loginSchema = z.object({
  userCredential: loginInputSchema,
});

export const requestPasswordResetInputSchema = z.object({
  email: emailSchema,
});

export const requestPasswordResetSchema = z.object({
  userData: requestPasswordResetInputSchema,
});

export const resetPasswordInputSchema = z.object({
  token: requiredSchema,
  password: passwordSchema,
});

export const resetPasswordSchema = z.object({
  userData: resetPasswordInputSchema,
});

import {
  loginInputSchema,
  registerInputSchema,
  requestPasswordResetInputSchema,
  resetPasswordInputSchema,
} from "@/modules/auth/validators/auth.validator";
import { z } from "zod";

export type RegisterInput = z.infer<typeof registerInputSchema>;
export type LoginInput = z.infer<typeof loginInputSchema>;
export type RequestPasswordResetInput = z.infer<typeof requestPasswordResetInputSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordInputSchema>;

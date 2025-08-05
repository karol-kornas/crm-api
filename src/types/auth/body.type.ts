import {
  loginSchema,
  registerSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
} from "@/modules/auth/validators/auth.validator";
import { z } from "zod";

export type RegisterBody = z.infer<typeof registerSchema>;
export type LoginBody = z.infer<typeof loginSchema>;
export type RequestPasswordResetBody = z.infer<typeof requestPasswordResetSchema>;
export type ResetPasswordBody = z.infer<typeof resetPasswordSchema>;

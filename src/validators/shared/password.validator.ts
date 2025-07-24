import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, { message: "validation.password.min_length" })
  .max(64, { message: "validation.password.max_length" })
  .regex(/[a-z]/, { message: "validation.password.lowercase" })
  .regex(/[A-Z]/, { message: "validation.password.uppercase" })
  .regex(/[0-9]/, { message: "validation.password.number" })
  .regex(/[^A-Za-z0-9]/, { message: "validation.password.special" });

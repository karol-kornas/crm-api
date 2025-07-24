import { z } from "zod";

export const emailSchema = z.email({ message: "validation.email.invalid" });

import { z } from "zod";

export const requiredSchema = z.string().min(1, { message: "validation.required" });

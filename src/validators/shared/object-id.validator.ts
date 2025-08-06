import { messageKeys } from "@/config/message-keys";
import { z } from "zod";

export const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, messageKeys.VALIDATE.INVALID_ID_FORMAT);

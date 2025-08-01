import { messageKeys } from "@/config/message-keys";
import { Request, Response, NextFunction } from "express";
import { ZodError, ZodObject, ZodRawShape } from "zod";

export const validate = (schema: ZodObject<ZodRawShape>) => (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: messageKeys.VALIDATE.FAILED,
        errors: err.issues,
      });
    }
    return res.status(500).json({
      success: false,
      message: messageKeys.INTERNAL_ERROR,
    });
  }
};

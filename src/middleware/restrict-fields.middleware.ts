import { messageKeys } from "@/config/message-keys";
import { Request, Response, NextFunction } from "express";
import createError from "http-errors";

export const restrictFields = (forbiddenFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const bodyFields = Object.keys(req.body);
    const hasForbidden = bodyFields.some((field) => forbiddenFields.includes(field));

    if (hasForbidden) {
      return next(
        createError(403, messageKeys.PROJECT.PERMISSION.FORBIDDEN_MODIFY_FIELDS + ": " + forbiddenFields.join(", "))
      );
    }

    next();
  };
};

import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import { Role } from "@/constants/enums";
import { messageKeys } from "@/config/message-keys";

export const authorizeRoles = (allowedRoles: readonly Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role as Role;
    if (!userRole) {
      return next(createError(401, messageKeys.UNAUTHORIZED));
    }
    if (!allowedRoles.includes(userRole)) {
      return next(createError(403, messageKeys.INSUFFICIENT_ROLE));
    }
    next();
  };
};

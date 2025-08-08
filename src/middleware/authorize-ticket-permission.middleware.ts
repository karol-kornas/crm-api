import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import { messageKeys } from "@/config/message-keys";
import { ProjectMember } from "@/models/project/project-member.model";
import { ProjectPermissions } from "@/types/projects/shared.type";
import { Ticket } from "@/models/ticket/ticket.model";

export const authorizeTicketPermission = (permissionKey?: keyof ProjectPermissions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const ticketId = req.params.id;

    if (!userId || !ticketId) {
      return next(createError(400, messageKeys.TICKET.PERMISSION.INVALID_REQUEST));
    }

    const ticket = await Ticket.findById(ticketId).select("createdBy project");
    if (!ticket) {
      return next(createError(404, messageKeys.TICKET.NOT_FOUND));
    }

    if (userRole === "admin") {
      return next();
    }

    if (String(ticket.createdBy) === String(userId)) {
      return next();
    }

    const member = await ProjectMember.findOne({
      project: ticket.project,
      user: userId,
    }).select("permissions");

    if (!member) {
      return next(createError(403, messageKeys.PROJECT.PERMISSION.NOT_A_MEMBER));
    }

    if (permissionKey) {
      if (!member.permissions?.[permissionKey]) {
        return next(createError(403, messageKeys.TICKET.PERMISSION.FORBIDDEN));
      }
    }

    next();
  };
};

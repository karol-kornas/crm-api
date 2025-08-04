import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import { messageKeys } from "@/config/message-keys";
import { Project } from "@/models/project/project.model";
import { ProjectMember } from "@/models/project/project-member.model";
import { ProjectPermissions } from "@/types/projects/shared.type";

export const authorizeProjectPermission = (permissionKey?: keyof ProjectPermissions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const projectSlug = req.params.slug;
    if (!userId || !projectSlug) {
      return next(createError(400, messageKeys.PROJECT.PERMISSION.INVALID_REQUEST));
    }

    const project = await Project.findOne({ slug: projectSlug }).select("_id owner");
    if (!project) {
      return next(createError(404, messageKeys.PROJECT.NOT_FOUND));
    }

    if (String(project.owner) === String(userId)) {
      return next();
    }

    const member = await ProjectMember.findOne({
      project: project._id,
      user: userId,
    });

    if (!member) {
      return next(createError(403, messageKeys.PROJECT.PERMISSION.NOT_A_MEMBER));
    }

    if (permissionKey) {
      if (!member.permissions?.[permissionKey]) {
        return next(createError(403, messageKeys.PROJECT.PERMISSION.FORBIDDEN));
      }
    }

    next();
  };
};

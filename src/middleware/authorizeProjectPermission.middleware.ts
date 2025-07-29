import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import { messageKeys } from "@/config/messageKeys";
import { Project } from "@/models/project/project.model";
import { ProjectMember } from "@/models/projectMember/projectMember.model";
import { ProjectPermission } from "@/types/projectMember";

export const authorizeProjectPermission = (permissionKey: keyof ProjectPermission) => {
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

    if (!member.permissions?.[permissionKey]) {
      return next(createError(403, messageKeys.PROJECT.PERMISSION.FORBIDDEN));
    }

    next();
  };
};

import { NextFunction, Request, Response } from "express";
import * as projectService from "@/project/services/project.service";
import { messageKeys } from "@/config/messageKeys";
import createError from "http-errors";

export const createProjectController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.user!.id;
    const projectData = req.body;
    const project = await projectService.createProject(ownerId, projectData);
    return res.status(201).json({
      success: true,
      message: messageKeys.PROJECT.CREATE.SUCCESS,
      data: project,
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.PROJECT.CREATE.FAILED));
    }
    next(err);
  }
};

export const updateProjectController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const updateProjectData = req.body;
    if (!slug) {
      throw createError(404, messageKeys.PROJECT.SLUG_REQUIRED);
    }
    const updatedProject = await projectService.updateProject(slug, updateProjectData);
    return res.status(200).json({
      message: messageKeys.PROJECT.UPDATE.SUCCESS,
      data: updatedProject,
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.PROJECT.UPDATE.FAILED));
    }
    next(err);
  }
};

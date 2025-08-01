import { NextFunction, Request, Response } from "express";
import * as projectService from "@/modules/projects/services/projects.service";
import { messageKeys } from "@/config/message-keys";
import createError from "http-errors";

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.user!.id;
    const projectData = req.body;
    const { project, members } = await projectService.createProject(ownerId, projectData);
    return res.status(201).json({
      success: true,
      message: messageKeys.PROJECT.CREATE.SUCCESS,
      data: {
        project,
        members,
      },
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.PROJECT.CREATE.FAILED));
    }
    next(err);
  }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const projectData = req.body;
    if (!slug) {
      throw createError(404, messageKeys.PROJECT.SLUG_REQUIRED);
    }
    const updatedProject = await projectService.updateProject(slug, projectData);
    return res.status(200).json({
      message: messageKeys.PROJECT.UPDATE.SUCCESS,
      data: {
        project: updatedProject,
      },
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.PROJECT.UPDATE.FAILED));
    }
    next(err);
  }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const deletedProject = await projectService.deleteProject(slug);

    res.status(200).json({
      success: true,
      message: messageKeys.PROJECT.DELETE.SUCCESS,
      data: {
        project: deletedProject,
      },
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.PROJECT.DELETE.FAILED));
    }
    next(err);
  }
};

export const addMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const members = req.body;

    if (!slug) {
      throw createError(400, messageKeys.PROJECT.SLUG_REQUIRED);
    }

    const newMembers = await projectService.addMembers({ projectSlug: slug, members });

    return res.status(201).json({
      success: true,
      message: messageKeys.PROJECT_MEMBERS.ADD.SUCCESS,
      data: { members: newMembers },
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.PROJECT_MEMBERS.ADD.FAILED));
    }
    next(err);
  }
};

export const setMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const members = req.body;

    if (!slug) {
      throw createError(400, messageKeys.PROJECT.SLUG_REQUIRED);
    }

    const newMembers = await projectService.setMembers({ projectSlug: slug, members });

    return res.status(200).json({
      success: true,
      message: messageKeys.PROJECT_MEMBERS.SET.SUCCESS,
      data: { members: newMembers },
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.PROJECT_MEMBERS.SET.FAILED));
    }
    next(err);
  }
};

export const removeMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const userIds = req.body as string[];

    if (!slug) {
      throw createError(400, messageKeys.PROJECT.SLUG_REQUIRED);
    }

    const deletedCount = await projectService.removeMembers(slug, userIds);

    return res.status(200).json({
      success: true,
      message: messageKeys.PROJECT_MEMBERS.REMOVE.SUCCESS,
      data: { deletedCount },
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.PROJECT_MEMBERS.REMOVE.FAILED));
    }
    next(err);
  }
};

export const getMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      throw createError(400, messageKeys.PROJECT.SLUG_REQUIRED);
    }

    const members = await projectService.getMembers(slug);

    return res.status(200).json({
      success: true,
      message: messageKeys.PROJECT_MEMBERS.GET.SUCCESS,
      data: { members },
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.PROJECT_MEMBERS.GET.FAILED));
    }
    next(err);
  }
};

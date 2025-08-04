import { RequestHandler } from "express";
import * as projectsService from "@/modules/projects/services/projects.service";
import { messageKeys } from "@/config/message-keys";
import createError from "http-errors";
import { DeleteProjectResponse, ProjectResponse } from "@/types/projects/response.type";
import { ProjectBody, UpdateProjectBody } from "@/types/projects/body.type";

export const createProject: RequestHandler<{}, ProjectResponse, ProjectBody> = async (req, res, next) => {
  try {
    const ownerId = req.user!.id;
    const { projectData } = req.body;
    const project = await projectsService.createProject({ ownerId, projectData });
    return res.status(201).json({
      success: true,
      message: messageKeys.PROJECT.CREATE.SUCCESS,
      data: {
        project,
      },
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.PROJECT.CREATE.FAILED));
    }
    next(err);
  }
};

export const updateProject: RequestHandler<{ slug: string }, ProjectResponse, UpdateProjectBody> = async (
  req,
  res,
  next
) => {
  try {
    const { slug } = req.params;
    const { projectData } = req.body;
    if (!slug) {
      throw createError(404, messageKeys.PROJECT.SLUG_REQUIRED);
    }
    const updatedProject = await projectsService.updateProject({ projectSlug: slug, projectData });
    return res.status(200).json({
      success: true,
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

export const deleteProject: RequestHandler<{ slug: string }, DeleteProjectResponse> = async (
  req,
  res,
  next
) => {
  try {
    const { slug } = req.params;
    const deletedProject = await projectsService.deleteProject(slug);

    res.status(200).json({
      success: true,
      message: messageKeys.PROJECT.DELETE.SUCCESS,
      data: {
        deletedProject,
      },
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.PROJECT.DELETE.FAILED));
    }
    next(err);
  }
};

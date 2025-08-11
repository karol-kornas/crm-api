import { RequestHandler } from "express";
import * as projectsService from "@/modules/projects/services/projects.service";
import { messageKeys } from "@/config/message-keys";
import createError from "http-errors";
import {
  DeleteProjectResponse,
  GetProjectResponse,
  GetProjectsMinimalResponse,
  GetProjectsResponse,
  ProjectResponse,
} from "@/types/projects/response.type";
import { ProjectBody, ProjectUpdateBody } from "@/types/projects/body.type";
import { GetProjectsQuery } from "@/types/projects/query.type";

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

export const updateProject: RequestHandler<{ slug: string }, ProjectResponse, ProjectUpdateBody> = async (
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

export const getProjects: RequestHandler<{}, GetProjectsResponse, {}, GetProjectsQuery> = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const { projectId, status, owner, page, limit, sortBy, order } = req.query;

    const result = await projectsService.getProjects({
      userId,
      userRole,
      projectId,
      status,
      owner,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      sortBy,
      order,
    });

    return res.status(200).json({
      success: true,
      message: messageKeys.PROJECT.GET.ALL.SUCCESS,
      data: {
        projects: result.projects,
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPage: result.totalPage,
        sortBy: result.sortBy,
        order: result.order,
        projectId: result.projectId,
        status: result.status,
      },
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.PROJECT.GET.ALL.FAILED));
    }
    next(err);
  }
};

export const getProject: RequestHandler<{ id: string }, GetProjectResponse> = async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const { id } = req.params;

    const { project, members } = await projectsService.getProject({ projectId: id, userId, userRole });
    return res.status(200).json({
      success: true,
      message: messageKeys.PROJECT.GET.SUCCESS,
      data: {
        project,
        members,
      },
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.PROJECT.GET.FAILED));
    }
    next(err);
  }
};

export const getProjectsMinimal: RequestHandler<{}, GetProjectsMinimalResponse> = async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const projects = await projectsService.getProjectsMinimal({ userId, userRole });

    return res.status(200).json({
      success: true,
      message: messageKeys.PROJECT.GET.ALL.SUCCESS,
      data: {
        projects,
      },
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.PROJECT.GET.ALL.FAILED));
    }
    next(err);
  }
};

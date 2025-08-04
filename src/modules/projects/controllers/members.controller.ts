import { RequestHandler } from "express";
import * as membersService from "@/modules/projects/services/members.service";
import createError from "http-errors";
import { messageKeys } from "@/config/message-keys";
import { ProjectMembersBody, RemoveProjectMembersBody } from "@/types/projects/body.type";
import { ProjectMembersResponse, RemoveProjectMembersResponse } from "@/types/projects/response.type";

export const addMembers: RequestHandler<
  { slug: string },
  ProjectMembersResponse,
  ProjectMembersBody
> = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { members } = req.body;

    if (!slug) {
      throw createError(400, messageKeys.PROJECT.SLUG_REQUIRED);
    }

    const newMembers = await membersService.addMembers({ projectSlug: slug, members });

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

export const setMembers: RequestHandler<
  { slug: string },
  ProjectMembersResponse,
  ProjectMembersBody
> = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { members } = req.body;

    if (!slug) {
      throw createError(400, messageKeys.PROJECT.SLUG_REQUIRED);
    }

    const newMembers = await membersService.setMembers({ projectSlug: slug, members });

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

export const removeMembers: RequestHandler<
  { slug: string },
  RemoveProjectMembersResponse,
  RemoveProjectMembersBody
> = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { userIds } = req.body;

    if (!slug) {
      throw createError(400, messageKeys.PROJECT.SLUG_REQUIRED);
    }

    const removedMembers = await membersService.removeMembers({ projectSlug: slug, userIds });

    return res.status(200).json({
      success: true,
      message: messageKeys.PROJECT_MEMBERS.REMOVE.SUCCESS,
      data: { removedMembers },
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.PROJECT_MEMBERS.REMOVE.FAILED));
    }
    next(err);
  }
};

export const getMembers: RequestHandler<{ slug: string }, ProjectMembersResponse> = async (
  req,
  res,
  next
) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      throw createError(400, messageKeys.PROJECT.SLUG_REQUIRED);
    }

    const members = await membersService.getMembers(slug);

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

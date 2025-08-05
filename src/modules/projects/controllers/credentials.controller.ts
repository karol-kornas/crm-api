import { RequestHandler } from "express";
import * as credentialsService from "@/modules/projects/services/credentials.service";
import { messageKeys } from "@/config/message-keys";
import createError from "http-errors";
import { ProjectCredentialResponse, RemoveProjectCredentialResponse } from "@/types/projects/response.type";
import { ProjectCredentialBody, ProjectCredentialUpdateBody } from "@/types/projects/body.type";

export const addCredential: RequestHandler<
  { slug: string },
  ProjectCredentialResponse,
  ProjectCredentialBody
> = async (req, res, next) => {
  try {
    const ownerId = req.user!.id;
    const { slug } = req.params;
    const { credentialData } = req.body;
    const credential = await credentialsService.addCredential({ ownerId, projectSlug: slug, credentialData });

    return res.status(201).json({
      success: true,
      message: messageKeys.PROJECT_CREDENTIALS.ADD.SUCCESS,
      data: {
        credential,
      },
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.PROJECT_CREDENTIALS.ADD.FAILED));
    }
    next(err);
  }
};

export const removeCredential: RequestHandler<
  { slug: string; id: string },
  RemoveProjectCredentialResponse
> = async (req, res, next) => {
  try {
    const { slug, id } = req.params;
    const removedCredential = await credentialsService.removeCredential(slug, id);

    return res.status(200).json({
      success: true,
      message: messageKeys.PROJECT_CREDENTIALS.REMOVE.SUCCESS,
      data: {
        removedCredential,
      },
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.PROJECT_CREDENTIALS.REMOVE.FAILED));
    }
    next(err);
  }
};

export const updateCredential: RequestHandler<
  { slug: string; id: string },
  ProjectCredentialResponse,
  ProjectCredentialUpdateBody
> = async (req, res, next) => {
  try {
    const { slug, id } = req.params;
    const { credentialData } = req.body;
    const updatedCredential = await credentialsService.updateCredential({
      credentialId: id,
      projectSlug: slug,
      credentialData,
    });

    return res.status(200).json({
      success: true,
      message: messageKeys.PROJECT_CREDENTIALS.UPDATE.SUCCESS,
      data: {
        credential: updatedCredential,
      },
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.PROJECT_CREDENTIALS.UPDATE.FAILED));
    }
    next(err);
  }
};

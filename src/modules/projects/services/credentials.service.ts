import { messageKeys } from "@/config/message-keys";
import { Project } from "@/models/project/project.model";
import { ICredential, IProject } from "@/types/projects/model.type";
import { ProjectCredentialParams, UpdateProjectCredentialParams } from "@/types/projects/params.type";
import createError from "http-errors";
import { Types } from "mongoose";

export const addCredential = async ({ ownerId, projectSlug, credentialData }: ProjectCredentialParams) => {
  const project = await Project.findOne({ slug: projectSlug });

  if (!project) {
    throw createError(404, messageKeys.PROJECT.NOT_FOUND);
  }

  const newCredential: ICredential = {
    ...credentialData,
    owner: new Types.ObjectId(ownerId),
  };

  project.credentials.push(newCredential);

  await project.save();

  return project.credentials[0];
};

export const removeCredential = async (projectSlug: string, credentialId: string) => {
  const project: IProject | null = await Project.findOne({ slug: projectSlug });

  if (!project) {
    throw createError(404, messageKeys.PROJECT.NOT_FOUND);
  }

  const credentialObjectId = new Types.ObjectId(credentialId);

  const credentialToRemove = project.credentials.find((cred) => cred._id?.equals(credentialObjectId));

  if (!credentialToRemove) {
    throw createError(404, messageKeys.PROJECT_CREDENTIALS.NOT_FOUND);
  }

  project.credentials = project.credentials.filter((cred) => !cred._id?.equals(credentialObjectId));

  await project.save();

  return credentialToRemove;
};

export const updateCredential = async ({
  credentialId,
  projectSlug,
  credentialData,
}: UpdateProjectCredentialParams) => {
  const project: IProject | null = await Project.findOne({ slug: projectSlug });

  if (!project) {
    throw createError(404, messageKeys.PROJECT.NOT_FOUND);
  }

  const credentialObjectId = new Types.ObjectId(credentialId);

  const credential = project.credentials.find((cred) => cred._id?.equals(credentialObjectId));

  if (!credential) {
    throw createError(404, messageKeys.PROJECT_CREDENTIALS.NOT_FOUND);
  }

  const updatedCredential = Object.assign(credential, credentialData);

  await project.save();

  return updatedCredential;
};

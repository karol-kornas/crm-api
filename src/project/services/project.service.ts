import { messageKeys } from "@/config/messageKeys";
import { Project } from "@/models/project/project.model";
import { IProject } from "@/types/project";
import createError from "http-errors";

export const createProject = async (ownerId: string, data: Partial<IProject>) => {
  if (!data.name) {
    throw createError(401, messageKeys.PROJECT.CREATE.NAME_REQUIRED);
  }

  const name = data.name.trim();
  const existing = await Project.findOne({ name: name });

  if (existing) {
    throw createError(409, messageKeys.PROJECT.CREATE.NAME_ALREADY_EXISTS);
  }

  const credentials = data.credentials?.map((credential) => {
    return {
      ...credential,
      owner: ownerId,
    };
  });

  const project = new Project({
    ...data,
    name,
    owner: ownerId,
    credentials,
  });

  try {
    await project.save();
  } catch (err: any) {
    if (err.code === 11000 && err.keyPattern?.slug) {
      throw createError(409, messageKeys.PROJECT.CREATE.NAME_ALREADY_EXISTS);
    }
    throw createError(500, messageKeys.PROJECT.CREATE.FAILED);
  }

  return project;
};

export const updateProject = async (projectSlug: string, data: Partial<IProject>) => {
  const project = await Project.findOneAndUpdate({ slug: projectSlug }, data, { new: true });

  if (!project) {
    throw createError(404, messageKeys.PROJECT.NOT_FOUND);
  }

  return project;
};

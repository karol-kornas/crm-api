import { messageKeys } from "@/config/message-keys";
import { ProjectMember } from "@/models/project/project-member.model";
import { Project } from "@/models/project/project.model";
import createError from "http-errors";
import { addMembers } from "./members.service";
import { CreateProjectParams, UpdateProjectParams } from "@/types/projects/params.type";

export const createProject = async ({ ownerId, projectData }: CreateProjectParams) => {
  const name = projectData.name?.trim();

  if (!name) {
    throw createError(401, messageKeys.PROJECT.CREATE.NAME_REQUIRED);
  }

  const existing = await Project.findOne({ name: name });

  if (existing) {
    throw createError(409, messageKeys.PROJECT.CREATE.NAME_ALREADY_EXISTS);
  }

  const credentials = projectData.credentials?.map((credential) => ({ ...credential, owner: ownerId })) ?? [];

  let project;
  let members;

  try {
    project = await Project.create({
      ...projectData,
      name,
      owner: ownerId,
      credentials,
    });
  } catch (err: any) {
    if (err.code === 11000 && err.keyPattern?.slug) {
      throw createError(409, messageKeys.PROJECT.CREATE.NAME_ALREADY_EXISTS);
    }
    throw createError(500, messageKeys.PROJECT.CREATE.FAILED);
  }

  try {
    members = projectData.members
      ? await addMembers({ projectSlug: project.slug, members: projectData.members })
      : [];
  } catch (err: any) {
    await deleteProject(project.slug);
    throw createError(500, messageKeys.PROJECT_MEMBERS.ADD.FAILED);
  }

  return project;
};

export const updateProject = async ({ projectSlug, projectData }: UpdateProjectParams) => {
  const project = await Project.findOneAndUpdate({ slug: projectSlug }, projectData, { new: true });

  if (!project) {
    throw createError(404, messageKeys.PROJECT.NOT_FOUND);
  }

  return project;
};

export const deleteProject = async (projectSlug: string) => {
  const project = await Project.findOneAndDelete({ slug: projectSlug });

  if (!project) {
    throw createError(404, messageKeys.PROJECT.NOT_FOUND);
  }

  await ProjectMember.deleteMany({ project: project._id });

  return project;
};

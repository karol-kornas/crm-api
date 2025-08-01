import { messageKeys } from "@/config/message-keys";
import { ProjectMember } from "@/models/project/project-member.model";
import { Project } from "@/models/project/project.model";
import { AddProjectMembersParams, CreateProjectParams, IProject } from "@/types/project";
import createError from "http-errors";
import { Types } from "mongoose";

export const createProject = async (ownerId: string, projectData: CreateProjectParams) => {
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
    members = projectData.members ? await addMembers({ projectSlug: project.slug, members: projectData.members }) : [];
  } catch (err: any) {
    await deleteProject(project.slug);
    throw createError(500, messageKeys.PROJECT_MEMBERS.ADD.FAILED);
  }

  return { project, members };
};

export const updateProject = async (projectSlug: string, data: Partial<CreateProjectParams>) => {
  const project = await Project.findOneAndUpdate({ slug: projectSlug }, data, { new: true });

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

export async function addMembers({ projectSlug, members }: AddProjectMembersParams) {
  const project = await Project.findOne({ slug: projectSlug });

  if (!project) {
    throw createError(404, messageKeys.PROJECT.NOT_FOUND);
  }

  const docs = members.map((m) => {
    return {
      project: project._id,
      user: m.userId,
      position: m.position || null,
      permissions: {
        canEditProject: m.permissions?.canEditProject ?? false,
        canEditCredentials: m.permissions?.canEditCredentials ?? false,
      },
    };
  });

  return await ProjectMember.insertMany(docs, { ordered: false });
}

export async function setMembers({ projectSlug, members }: AddProjectMembersParams) {
  const project = await Project.findOne({ slug: projectSlug });

  if (!project) {
    throw createError(404, messageKeys.PROJECT.NOT_FOUND);
  }

  const incomingUserIds = members.map((m) => new Types.ObjectId(m.userId));

  const projectId = project._id;

  await ProjectMember.deleteMany({
    project: projectId,
    user: {
      $nin: incomingUserIds,
    },
  });

  const ops = members.map((m) => {
    return ProjectMember.updateOne(
      { project: projectId, user: m.userId },
      {
        $set: {
          position: m.position || null,
          permissions: {
            canEditProject: m.permissions?.canEditProject ?? false,
            canEditCredentials: m.permissions?.canEditCredentials ?? false,
          },
        },
      },
      { upsert: true }
    );
  });

  await Promise.all(ops);

  return ProjectMember.find({ project: projectId }).populate("user");
}

export async function removeMembers(projectSlug: string, userIds: string[]) {
  const project = await Project.findOne({ slug: projectSlug });

  if (!project) {
    throw createError(404, messageKeys.PROJECT.NOT_FOUND);
  }

  const result = await ProjectMember.deleteMany({
    project: project._id,
    user: { $in: userIds.map((id) => new Types.ObjectId(id)) },
  });
  return result.deletedCount;
}

export async function getMembers(projectSlug: string) {
  const project = await Project.findOne({ slug: projectSlug });

  if (!project) {
    throw createError(404, messageKeys.PROJECT.NOT_FOUND);
  }

  return await ProjectMember.find({ project: project._id }).populate("user");
}

import { messageKeys } from "@/config/message-keys";
import { ProjectMember } from "@/models/project/project-member.model";
import { Project } from "@/models/project/project.model";
import createError from "http-errors";
import { addMembers } from "./members.service";
import {
  CreateProjectParams,
  GetProjectParams,
  GetProjectsMinimalParams,
  GetProjectsParams,
  UpdateProjectParams,
} from "@/types/projects/params.type";
import { PROJECT_STATUSES } from "@/constants/enums";
import { Types } from "mongoose";
import { getAccessibleProjectIds } from "@/utils/projects/get-accessible-project-ids.util";
import { getAndAssertAccessibleProjectIds } from "@/utils/projects/get-and-assert-accessible-project-ids.util";
import { getSortOption } from "@/utils/get-sort-option.util";

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
    await ProjectMember.create({
      user: ownerId,
      project: project._id,
      permissions: {
        canEditCredentials: true,
        canEditProject: true,
        canEditTickets: true,
        canDeleteProject: true,
      },
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
  const project = await Project.findOneAndUpdate({ slug: projectSlug }, projectData, {
    new: true,
    runValidators: true,
  });

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

export const getProjects = async (params: GetProjectsParams) => {
  const {
    userId,
    userRole,
    projectId,
    status,
    owner,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
  } = params;

  const accessibleIds = await getAndAssertAccessibleProjectIds(userId, userRole, projectId);

  const query: Record<string, any> = {};

  if (accessibleIds.length > 0) {
    query._id = { $in: accessibleIds };
  }

  if (projectId) {
    query._id = projectId;
  }

  if (status && PROJECT_STATUSES.includes(status)) {
    query.status = status;
  }
  if (owner) query.owner = owner;

  const sortOption = getSortOption(sortBy, order);

  const skip = (page - 1) * limit;

  const [projects, total] = await Promise.all([
    Project.find(query).sort(sortOption).skip(skip).limit(limit),
    Project.countDocuments(query),
  ]);

  const totalPage = Math.ceil(total / limit);

  return {
    projects,
    page,
    limit,
    total,
    totalPage,
    sortBy,
    order,
    projectId,
    status,
  };
};

export const getProject = async ({ projectId, userId, userRole }: GetProjectParams) => {
  const project = await Project.findById(projectId).populate("owner").populate("credentials.owner");

  if (!project) {
    throw createError(404, messageKeys.PROJECT.NOT_FOUND);
  }

  await getAndAssertAccessibleProjectIds(userId, userRole, projectId);

  const members = await ProjectMember.find({ project: projectId }).populate("user");

  return {
    project,
    members,
  };
};

export const getProjectsMinimal = async ({ userId, userRole }: GetProjectsMinimalParams) => {
  const accessibleIds = await getAndAssertAccessibleProjectIds(userId, userRole);
  const query = accessibleIds.length > 0 ? { _id: { $in: accessibleIds } } : {};
  const projects = await Project.find(query).select("_id name").lean();

  return projects;
};

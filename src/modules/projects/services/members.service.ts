import { messageKeys } from "@/config/message-keys";
import { ProjectMember } from "@/models/project/project-member.model";
import { Project } from "@/models/project/project.model";
import { ProjectMembersParams, RemoveProjectMembersParams } from "@/types/projects/params.type";
import createError from "http-errors";
import { Types } from "mongoose";

export async function addMembers({ projectSlug, members }: ProjectMembersParams) {
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

export async function setMembers({ projectSlug, members }: ProjectMembersParams) {
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

export async function removeMembers({ projectSlug, userIds }: RemoveProjectMembersParams) {
  const project = await Project.findOne({ slug: projectSlug });

  if (!project) {
    throw createError(404, messageKeys.PROJECT.NOT_FOUND);
  }

  const objectIds = userIds.map((id) => new Types.ObjectId(id));

  const removedMembers = await ProjectMember.find({
    project: project._id,
    user: { $in: objectIds },
  });

  await ProjectMember.deleteMany({
    project: project._id,
    user: { $in: objectIds },
  });

  return removedMembers;
}

export async function getMembers(projectSlug: string) {
  const project = await Project.findOne({ slug: projectSlug });

  if (!project) {
    throw createError(404, messageKeys.PROJECT.NOT_FOUND);
  }

  return await ProjectMember.find({ project: project._id }).populate("user");
}

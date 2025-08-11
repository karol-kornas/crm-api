import { ProjectStatus } from "@/constants/enums";
import { ICredential, IProject, IProjectMember } from "./model.type";
import { ObjectId } from "mongoose";

export interface ProjectResponse {
  success: boolean;
  message: string;
  data: {
    project: IProject;
  };
}

export interface DeleteProjectResponse {
  success: boolean;
  message: string;
  data: {
    deletedProject: IProject;
  };
}

export interface ProjectMembersResponse {
  success: boolean;
  message: string;
  data: {
    members: IProjectMember[];
  };
}

export interface RemoveProjectMembersResponse {
  success: boolean;
  message: string;
  data: {
    removedMembers: IProjectMember[];
  };
}

export interface ProjectCredentialResponse {
  success: boolean;
  message: string;
  data: {
    credential: ICredential;
  };
}

export interface RemoveProjectCredentialResponse {
  success: boolean;
  message: string;
  data: {
    removedCredential: ICredential;
  };
}

export interface GetProjectsResponse {
  success: boolean;
  message: string;
  data: {
    projects: IProject[];
    page: number;
    limit: number;
    total: number;
    totalPage: number;
    sortBy: string;
    order: "asc" | "desc";
    projectId?: string;
    status?: ProjectStatus;
  };
}

export interface GetProjectResponse {
  success: boolean;
  message: string;
  data: {
    project: IProject;
    members: IProjectMember[];
  };
}

export interface GetProjectsMinimalResponse {
  success: boolean;
  message: string;
  data: {
    projects:
      | {
          _id: string | ObjectId;
          name: string;
        }
      | {}[];
  };
}

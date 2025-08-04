import { ICredential, IProject, IProjectMember } from "./model.type";

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

import { Document } from "mongoose";
import { IUser } from "./user";
import { Types } from "mongoose";
import type { Environment, ProjectStatus, UserPosition } from "@/constants/enums";

export interface IProject extends Document {
  name: string;
  slug: string;
  description?: string;
  notes: string[];
  credentials: ICredential[];
  owner: Types.ObjectId | IUser;
  members?: IProjectMember[];
  status: ProjectStatus;
  deadline?: Date;
  tags: string[];
  archived: boolean;
  created_at: Date;
  updated_at: Date;
  attachments: string[];
}

export interface ICredential {
  name: string;
  url?: string;
  username?: string;
  password?: string;
  encrypted_password?: string;
  notes?: string;
  environment: Environment;
  owner: Types.ObjectId | IUser;
  created_at: Date;
  updated_at: Date;
}

export type ProjectPermissions = {
  canEditProject?: boolean;
  canEditCredentials?: boolean;
  CanDeleteProject?: boolean;
};

export interface IProjectMember extends Document {
  user: Types.ObjectId | IUser;
  project: Types.ObjectId | IProject;
  position?: UserPosition;
  permissions: ProjectPermissions;
  created_at: Date;
  updated_at: Date;
}

export interface AddProjectMemberInput {
  userId: string;
  position?: UserPosition;
  permissions?: ProjectPermissions;
}

export interface AddProjectMembersParams {
  projectSlug: string;
  members: AddProjectMemberInput[];
}

export interface ProjectCredentialInput {
  name: string;
  environment: Environment;
}

export interface CreateProjectParams {
  name: string;
  description?: string;
  tags?: string[];
  notes?: string[];
  deadline?: string | Date;
  credentials?: ProjectCredentialInput[];
  members?: AddProjectMemberInput[];
}

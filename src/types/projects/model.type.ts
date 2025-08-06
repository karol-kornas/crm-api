import { Document } from "mongoose";
import { Types } from "mongoose";
import type { Environment, ProjectStatus, UserPosition } from "@/constants/enums";
import { ProjectPermissions } from "./shared.type";
import { IUser } from "../auth/model.type";

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
  createdAt: Date;
  updatedAt: Date;
  attachments: string[];
}

export interface ICredential {
  _id?: Types.ObjectId;
  name: string;
  url?: string;
  username?: string;
  password?: string;
  encryptedPassword?: string;
  notes?: string;
  environment: Environment;
  owner: Types.ObjectId | IUser;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProjectMember extends Document {
  user: Types.ObjectId | IUser;
  project: Types.ObjectId | IProject;
  position?: UserPosition;
  permissions: ProjectPermissions;
  createdAt: Date;
  updatedAt: Date;
}

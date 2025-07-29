import { Document } from "mongoose";
import { IUser } from "./user";
import { Types } from "mongoose";
import { IProject } from "./project";

export type ProjectPermission = {
  canEditProject: boolean;
  canEditCredentials: boolean;
  canComment: boolean;
  canViewOnly: boolean;
};

export interface IProjectMember extends Document {
  user: Types.ObjectId | IUser;
  project: Types.ObjectId | IProject;
  permissions: ProjectPermission;
  created_at: Date;
  updated_at: Date;
}

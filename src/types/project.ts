import { Document } from "mongoose";
import { IUser } from "./user";
import { Types } from "mongoose";
import type { Environment, ProjectStatus } from "@/constants/enums";

export interface IProject extends Document {
  name: string;
  slug: string;
  description?: string;
  notes: string[];
  credentials: ICredential[];
  owner: Types.ObjectId | IUser;
  clients?: (Types.ObjectId | IUser)[];
  team_members?: (Types.ObjectId | IUser)[];
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

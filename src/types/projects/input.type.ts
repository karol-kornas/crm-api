import type { Environment, UserPosition } from "@/constants/enums";
import { ProjectPermissions } from "./shared.type";

export interface ProjectInput {
  name: string;
  description?: string;
  tags?: string[];
  notes?: string[];
  deadline?: string | Date;
  credentials?: ProjectCredentialInput[];
  members?: ProjectMemberInput[];
}

export interface ProjectMemberInput {
  userId: string;
  position?: UserPosition;
  permissions?: ProjectPermissions;
}

export interface ProjectCredentialInput {
  name: string;
  url?: string;
  username?: string;
  password?: string;
  notes?: string;
  environment: Environment;
  created_at?: Date;
  updated_at?: Date;
}

import { ProjectMemberInput, ProjectInput, ProjectCredentialInput } from "./input.type";

export interface ProjectBody {
  projectData: ProjectInput;
}

export interface UpdateProjectBody {
  projectData: Partial<Omit<ProjectInput, "credentials" | "members">>;
}

export interface ProjectMembersBody {
  members: ProjectMemberInput[];
}

export interface RemoveProjectMembersBody {
  userIds: string[];
}

export interface ProjectCredentialBody {
  credentialData: ProjectCredentialInput;
}

export interface UpdateProjectCredentialBody {
  credentialData: Partial<ProjectCredentialInput>;
}

import { ProjectInput, ProjectMemberInput, ProjectCredentialInput } from "./input.type";

export interface CreateProjectParams {
  ownerId: string;
  projectData: ProjectInput;
}

export interface UpdateProjectParams {
  projectSlug: string;
  projectData: Partial<Omit<ProjectInput, "credentials" | "members">>;
}

export interface ProjectMembersParams {
  projectSlug: string;
  members: ProjectMemberInput[];
}

export interface RemoveProjectMembersParams {
  projectSlug: string;
  userIds: string[];
}

export interface ProjectCredentialParams {
  ownerId: string;
  projectSlug: string;
  credentialData: ProjectCredentialInput;
}

export interface UpdateProjectCredentialParams {
  credentialId: string;
  projectSlug: string;
  credentialData: Partial<ProjectCredentialInput>;
}

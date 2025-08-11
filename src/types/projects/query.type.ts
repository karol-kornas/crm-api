import { ProjectStatus } from "@/constants/enums";

export type GetProjectsQuery = {
  projectId?: string;
  status?: ProjectStatus;
  owner?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  order?: "asc" | "desc";
};

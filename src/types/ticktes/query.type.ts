import { TicketStatus } from "@/constants/enums";

export type GetTicketsQuery = {
  projectId?: string;
  status?: TicketStatus;
  createdBy?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  order?: "asc" | "desc";
};

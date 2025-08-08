import { TicketStatus } from "@/constants/enums";
import { TicketCommentInput, TicketInput, TicketUpdateInput } from "./input.type";

export interface CreateTicketParams {
  projectSlug: string;
  createdById: string;
  ticketData: TicketInput;
}

export interface UpdateTicketParams {
  ticketId: string;
  ticketData: TicketUpdateInput;
}

export interface GetTicketsParams {
  userId: string;
  userRole: string;
  projectId?: string;
  status?: TicketStatus;
  createdBy?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface AddTicketCommentParams {
  ticketId: string;
  authorId: string;
  commentData: TicketCommentInput;
}

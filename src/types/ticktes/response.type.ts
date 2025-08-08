import { TicketStatus } from "@/constants/enums";
import { ITicket, ITicketComment } from "./model.type";

export interface TicketResponse {
  success: boolean;
  message: string;
  data: {
    ticket: ITicket;
  };
}

export interface DeleteTicketResponse {
  success: boolean;
  message: string;
  data: {
    deletedTicket: ITicket;
  };
}

export interface GetTicketsResponse {
  success: boolean;
  message: string;
  data: {
    tickets: ITicket[];
    page: number;
    limit: number;
    total: number;
    totalPage: number;
    sortBy: string;
    order: "asc" | "desc";
    projectId?: string;
    status?: TicketStatus;
  };
}

export interface TicketCommentResponse {
  success: boolean;
  message: string;
  data: {
    comment: ITicketComment;
  };
}

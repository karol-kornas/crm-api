import { ticketCommentSchema } from "@/modules/tickets/validators/comment.validator";
import { ticketSchema, ticketUpdateSchema } from "@/modules/tickets/validators/ticket.validator";
import { z } from "zod";

export type TicketBody = z.infer<typeof ticketSchema>;
export type TicketUpdateBody = z.infer<typeof ticketUpdateSchema>;

export type TicketCommentBody = z.infer<typeof ticketCommentSchema>;

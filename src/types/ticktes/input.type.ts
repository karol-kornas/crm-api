import { ticketCommentInputSchema } from "@/modules/tickets/validators/comment.validator";
import { ticketInputSchema, ticketInputUpdateSchema } from "@/modules/tickets/validators/ticket.validator";
import { z } from "zod";

export type TicketInput = z.infer<typeof ticketInputSchema>;
export type TicketUpdateInput = z.infer<typeof ticketInputUpdateSchema>;

export type TicketCommentInput = z.infer<typeof ticketCommentInputSchema>;

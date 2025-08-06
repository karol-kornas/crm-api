import { ticketSchema } from "@/modules/tickets/validators/ticket.validator";
import { z } from "zod";

export type TicketBody = z.infer<typeof ticketSchema>

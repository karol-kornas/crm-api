import { PRIORITY, TICKET_STATUSES } from "@/constants/enums";
import { objectIdSchema } from "@/validators/shared/object-id.validator";
import { requiredSchema } from "@/validators/shared/required.validator";
import { z } from "zod";

export const ticketInputSchema = z.object({
  title: requiredSchema,
  description: requiredSchema,
  projectId: objectIdSchema,
  assignedTo: objectIdSchema.optional(),
  status: z.enum(TICKET_STATUSES).default(TICKET_STATUSES[0]).optional(),
  priority: z.enum(PRIORITY).default(PRIORITY[0]).optional(),
  tags: z.array(z.string().min(1)).optional(),
  relatedTasksIds: z.array(objectIdSchema).optional(),
});

export const ticketInputUpdateSchema = ticketInputSchema.partial();

export const ticketSchema = z.object({
  ticketData: ticketInputSchema,
});

export const ticketUpdateSchema = z.object({
  ticketData: ticketInputUpdateSchema,
});

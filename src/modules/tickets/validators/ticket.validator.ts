import { PRIORITY, TICKET_STATUSES } from "@/constants/enums";
import { objectIdSchema } from "@/validators/shared/object-id.validator";
import { requiredSchema } from "@/validators/shared/required.validator";
import { z } from "zod";

export const ticketInputSchema = z.object({
    title: requiredSchema,
    description: requiredSchema,
    projectId: objectIdSchema,
    assignedTo: objectIdSchema.optional(),
    status: z.enum(TICKET_STATUSES),
    priority: z.enum(PRIORITY),
    tags: z.array(z.string()).optional(),
    relatedTasksId: z.array(objectIdSchema).optional(),
})

export const ticketSchema = z.object({
    ticketData: ticketInputSchema
})

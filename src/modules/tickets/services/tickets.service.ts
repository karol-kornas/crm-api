import { messageKeys } from "@/config/message-keys";
import { TICKET_STATUSES } from "@/constants/enums";
import { Project } from "@/models/project/project.model";
import { Ticket } from "@/models/ticket/ticket.model";
import { ITicket } from "@/types/ticktes/model.type";
import {
  CreateTicketParams,
  GetTicketParams,
  GetTicketsParams,
  UpdateTicketParams,
} from "@/types/ticktes/params.type";
import { getSortOption } from "@/utils/get-sort-option.util";
import { getAccessibleProjectIds } from "@/utils/projects/get-accessible-project-ids.util";
import { getAndAssertAccessibleProjectIds } from "@/utils/projects/get-and-assert-accessible-project-ids.util";
import createError from "http-errors";
import { Types } from "mongoose";

export const createTicket = async ({
  projectSlug,
  createdById,
  ticketData,
}: CreateTicketParams): Promise<ITicket> => {
  const project = await Project.findOne({ slug: projectSlug });

  if (!project) {
    throw createError(404, messageKeys.PROJECT.NOT_FOUND);
  }

  const ticket = new Ticket({
    ...ticketData,
    project: project._id,
    createdBy: createdById,
  });

  await ticket.save();

  return ticket;
};

export const updateTicket = async ({ ticketId, ticketData }: UpdateTicketParams): Promise<ITicket> => {
  if (!Types.ObjectId.isValid(ticketId)) {
    throw createError(400, messageKeys.TICKET.INVALID_ID);
  }
  const ticket = await Ticket.findByIdAndUpdate(ticketId, ticketData, { new: true, runValidators: true });

  if (!ticket) {
    throw createError(404, messageKeys.TICKET.NOT_FOUND);
  }

  return ticket;
};

export const deleteTicket = async (ticketId: string): Promise<ITicket> => {
  const ticket = await Ticket.findByIdAndDelete(ticketId);

  if (!ticket) {
    throw createError(404, messageKeys.TICKET.NOT_FOUND);
  }

  return ticket;
};

export const getTickets = async (params: GetTicketsParams) => {
  const {
    userId,
    userRole,
    projectId,
    status,
    createdBy,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
  } = params;

  const accessibleIds = await getAndAssertAccessibleProjectIds(userId, userRole, projectId);

  const query: Record<string, any> = {};

  if (accessibleIds.length > 0) {
    query.project = { $in: accessibleIds };
  }

  if (projectId) {
    query.project = projectId;
  }

  if (status && TICKET_STATUSES.includes(status)) {
    query.status = status;
  }

  if (createdBy) query.createdBy = createdBy;

  const skip = (page - 1) * limit;

  const sortOption = getSortOption(sortBy, order);

  const [tickets, total] = await Promise.all([
    Ticket.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate("project", "name")
      .populate("createdBy", "firstName lastName email"),
    Ticket.countDocuments(query),
  ]);

  const totalPage = Math.ceil(total / limit);

  return {
    tickets,
    page,
    limit,
    total,
    totalPage,
    sortBy,
    order,
    projectId,
    status,
  };
};

export const getTicket = async ({ ticketId, userId, userRole }: GetTicketParams) => {
  const ticket = await Ticket.findById(ticketId)
    .populate("project")
    .populate("createdBy")
    .populate("assignedTo")
    .populate("relatedTasks");

  if (!ticket) {
    throw createError(404, messageKeys.TICKET.NOT_FOUND);
  }

  await getAndAssertAccessibleProjectIds(userId, userRole, ticket.project._id as string);

  return ticket;
};

import { messageKeys } from "@/config/message-keys";
import { TICKET_STATUSES } from "@/constants/enums";
import { Project } from "@/models/project/project.model";
import { Ticket } from "@/models/ticket/ticket.model";
import { ITicket } from "@/types/ticktes/model.type";
import { CreateTicketParams, GetTicketsParams, UpdateTicketParams } from "@/types/ticktes/params.type";
import { getAccessibleProjectIds } from "@/utils/projects/get-accessible-project-ids.util";
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

  const query: Record<string, any> = {};

  if (userRole !== "admin") {
    const accessibleProjectIds = await getAccessibleProjectIds(userId);

    if (accessibleProjectIds.length === 0) {
      throw createError(403, messageKeys.PROJECT.PERMISSION.NOT_ACCESS_TO_ANY_PROJECTS);
    }

    if (projectId) {
      if (!accessibleProjectIds.includes(new Types.ObjectId(projectId))) {
        throw createError(403, messageKeys.PROJECT.PERMISSION.NOT_A_MEMBER);
      }
      query.project = projectId;
    } else {
      query.project = { $in: accessibleProjectIds };
    }
  } else {
    if (projectId) query.project = projectId;
  }

  if (status && TICKET_STATUSES.includes(status)) {
    query.status = status;
  }
  if (createdBy) query.createdBy = createdBy;

  const skip = (page - 1) * limit;

  const allowedSortFields = ["createdAt", "updatedAt"];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

  const sortOption: Record<string, 1 | -1> = {
    [sortField]: order === "asc" ? 1 : -1,
  };

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

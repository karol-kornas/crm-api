import { messageKeys } from "@/config/message-keys";
import { TicketBody, TicketUpdateBody } from "@/types/ticktes/body.type";
import { DeleteTicketResponse, GetTicketsResponse, TicketResponse } from "@/types/ticktes/response.type";
import { RequestHandler } from "express";
import createError from "http-errors";
import * as ticketsService from "@/modules/tickets/services/tickets.service";
import { GetTicketsQuery } from "@/types/ticktes/query.type";

export const createTicket: RequestHandler<{ slug: string }, TicketResponse, TicketBody> = async (
  req,
  res,
  next
) => {
  try {
    const { slug } = req.params;
    const createdById = req.user!.id;
    const { ticketData } = req.body;

    const ticket = await ticketsService.createTicket({ projectSlug: slug, createdById, ticketData });

    return res.status(201).json({
      success: true,
      message: messageKeys.TICKET.CREATE.SUCCESS,
      data: {
        ticket,
      },
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.TICKET.CREATE.FAILED));
    }
    next(err);
  }
};

export const updateTicket: RequestHandler<{ id: string }, TicketResponse, TicketUpdateBody> = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const { ticketData } = req.body;

    const updatedTicket = await ticketsService.updateTicket({ ticketId: id, ticketData });

    return res.status(200).json({
      success: true,
      message: messageKeys.TICKET.UPDATE.SUCCESS,
      data: {
        ticket: updatedTicket,
      },
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.TICKET.UPDATE.FAILED));
    }
    next(err);
  }
};

export const deleteTicket: RequestHandler<{ id: string }, DeleteTicketResponse> = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedTicket = await ticketsService.deleteTicket(id);

    return res.status(200).json({
      success: true,
      message: messageKeys.TICKET.DELETE.SUCCESS,
      data: {
        deletedTicket,
      },
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.TICKET.DELETE.FAILED));
    }
    next(err);
  }
};

export const getTickets: RequestHandler<{}, GetTicketsResponse, {}, GetTicketsQuery> = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const { projectId, status, createdBy, page, limit, sortBy, order } = req.query;

    const result = await ticketsService.getTickets({
      userId,
      userRole,
      projectId,
      status,
      createdBy,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      sortBy,
      order,
    });

    return res.status(200).json({
      success: true,
      message: messageKeys.TICKET.GET.SUCCESS,
      data: {
        tickets: result.tickets,
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPage: result.totalPage,
        sortBy: result.sortBy,
        order: result.order,
        projectId: result.projectId,
        status: result.status,
      },
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.TICKET.GET.FAILED));
    }
    next(err);
  }
};

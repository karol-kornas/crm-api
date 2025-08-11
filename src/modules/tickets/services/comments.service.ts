import { messageKeys } from "@/config/message-keys";
import { Ticket, TicketComment } from "@/models/ticket/ticket.model";
import { ITicketComment } from "@/types/ticktes/model.type";
import { AddTicketCommentParams, RemoveTicketCommentParams } from "@/types/ticktes/params.type";
import createError from "http-errors";
import { Types } from "mongoose";

export const addComment = async ({ ticketId, authorId, commentData }: AddTicketCommentParams) => {
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    throw createError(404, messageKeys.TICKET.NOT_FOUND);
  }

  const comment: ITicketComment = {
    ...commentData,
    author: new Types.ObjectId(authorId),
  };

  ticket.comments.push(comment);

  await ticket.save();

  return ticket.comments[ticket.comments.length - 1];
};

export const removeComment = async ({ ticketId, commentId }: RemoveTicketCommentParams) => {
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    throw createError(404, messageKeys.TICKET.NOT_FOUND);
  }

  const commentObjectId = new Types.ObjectId(commentId);

  const commentToRemove = ticket.comments.find((c) => c._id?.equals(commentObjectId));

  if (!commentToRemove) {
    throw createError(404, messageKeys.TICKET_COMMENTS.NOT_FOUND);
  }

  ticket.comments = ticket.comments.filter((c) => !c._id?.equals(commentObjectId));

  await ticket.save();

  return commentToRemove;
};

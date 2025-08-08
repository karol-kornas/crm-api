import { messageKeys } from "@/config/message-keys";
import { Ticket } from "@/models/ticket/ticket.model";
import { ITicketComment } from "@/types/ticktes/model.type";
import { AddTicketCommentParams } from "@/types/ticktes/params.type";
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

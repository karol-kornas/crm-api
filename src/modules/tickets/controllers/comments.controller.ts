import { messageKeys } from "@/config/message-keys";
import { TicketCommentBody } from "@/types/ticktes/body.type";
import { RemoveTicketCommentResponse, TicketCommentResponse } from "@/types/ticktes/response.type";
import { RequestHandler } from "express";
import createError from "http-errors";
import * as commentsService from "@/modules/tickets/services/comments.service";

export const addComment: RequestHandler<{ id: string }, TicketCommentResponse, TicketCommentBody> = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { commentData } = req.body;

    const comment = await commentsService.addComment({ ticketId: id, authorId: userId, commentData });

    return res.status(201).json({
      success: true,
      message: messageKeys.TICKET_COMMENTS.ADD.SUCCESS,
      data: {
        comment,
      },
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.TICKET_COMMENTS.ADD.FAILED));
    }
    next(err);
  }
};

export const removeComment: RequestHandler<
  { id: string; commentId: string },
  RemoveTicketCommentResponse
> = async (req, res, next) => {
  try {
    const { id, commentId } = req.params;
    const removedComment = await commentsService.removeComment({ ticketId: id, commentId });

    return res.status(200).json({
      success: true,
      message: messageKeys.TICKET_COMMENTS.REMOVE.SUCCESS,
      data: {
        removedComment,
      },
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.TICKET_COMMENTS.REMOVE.FAILED));
    }
    next(err);
  }
};

import { messageKeys } from "@/config/message-keys";
import { RequestHandler } from "express";
import createError from "http-errors";

export const createTicket: RequestHandler<{}> = (req, res, next) => {
    try {
        const { ticketData } = req.body;
    } catch (err: any) {
        if (!err.status) {
            return next(createError(500, messageKeys.TICKET.CREATE.FAILED));
        }
        next(err);
    }
}

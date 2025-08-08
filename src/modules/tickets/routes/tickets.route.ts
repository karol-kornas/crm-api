import { authenticate } from "@/middleware/auth.middleware";
import { authorizeRoles } from "@/middleware/authorize-role.middleware";
import { validate } from "@/middleware/validate-middleware";
import { Router } from "express";
import { ticketUpdateSchema } from "../validators/ticket.validator";
import { deleteTicket, getTickets, updateTicket } from "../controllers/tickets.controller";
import { authorizeTicketPermission } from "@/middleware/authorize-ticket-permission.middleware";
import { ticketCommentSchema } from "../validators/comment.validator";
import { addComment } from "../controllers/comments.controller";

const router = Router();

router.patch(
  "/:id",
  authenticate,
  authorizeRoles(["user", "admin", "client"]),
  authorizeTicketPermission("canEditTickets"),
  validate(ticketUpdateSchema),
  updateTicket
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles(["user", "admin", "client"]),
  authorizeTicketPermission("canEditTickets"),
  deleteTicket
);

router.get("/", authenticate, authorizeRoles(["user", "admin", "client"]), getTickets);

router.post(
  "/:id/comments",
  authenticate,
  authorizeRoles(["user", "admin", "client"]),
  authorizeTicketPermission(),
  validate(ticketCommentSchema),
  addComment
);

export default router;

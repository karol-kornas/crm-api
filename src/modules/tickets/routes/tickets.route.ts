import { authenticate } from "@/middleware/auth.middleware";
import { authorizeRoles } from "@/middleware/authorize-role.middleware";
import { validate } from "@/middleware/validate-middleware";
import { Router } from "express";
import { ticketUpdateSchema } from "../validators/ticket.validator";
import { deleteTicket, getTicket, getTickets, updateTicket } from "../controllers/tickets.controller";
import { authorizeTicketPermission } from "@/middleware/authorize-ticket-permission.middleware";
import { ticketCommentSchema } from "../validators/comment.validator";
import { addComment, removeComment } from "../controllers/comments.controller";

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

router.get("/", authenticate, getTickets);

router.get("/:id", authenticate, getTicket);

router.post(
  "/:id/comments",
  authenticate,
  authorizeRoles(["user", "admin", "client"]),
  authorizeTicketPermission(),
  validate(ticketCommentSchema),
  addComment
);

router.delete("/:id/comments/:commentId", authenticate, authorizeRoles(["admin"]), removeComment);

export default router;

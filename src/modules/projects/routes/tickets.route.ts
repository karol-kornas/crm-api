import { authenticate } from "@/middleware/auth.middleware";
import { authorizeRoles } from "@/middleware/authorize-role.middleware";
import { validate } from "@/middleware/validate-middleware";
import { Router } from "express";
import { authorizeProjectPermission } from "@/middleware/authorize-project-permission.middleware";
import { createTicket } from "@/modules/tickets/controllers/tickets.controller";
import { ticketSchema } from "@/modules/tickets/validators/ticket.validator";

const router = Router();

router.post(
  "/:slug/tickets",
  authenticate,
  authorizeRoles(["user", "admin", "client"]),
  authorizeProjectPermission(),
  validate(ticketSchema),
  createTicket
);

export default router;

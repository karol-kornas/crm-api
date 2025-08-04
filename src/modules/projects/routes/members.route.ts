import { authenticate } from "@/middleware/auth.middleware";
import { Router } from "express";
import {
  addMembers,
  setMembers,
  removeMembers,
  getMembers,

} from "../controllers/members.controller";
import { validate } from "@/middleware/validate-middleware";
import { authorizeRoles } from "@/middleware/authorize-role.middleware";
import { authorizeProjectPermission } from "@/middleware/authorize-project-permission.middleware";
import { projectMembersRemoveSchema, projectMembersSchema } from "../validators/member.validator";

const router = Router();

router.post(
  "/:slug/members",
  authenticate,
  authorizeRoles(["user", "admin"]),
  authorizeProjectPermission("canEditProject"),
  validate(projectMembersSchema),
  addMembers
);
router.put(
  "/:slug/members",
  authenticate,
  authorizeRoles(["user", "admin"]),
  authorizeProjectPermission("canEditProject"),
  validate(projectMembersSchema),
  setMembers
);
router.delete(
  "/:slug/members",
  authenticate,
  authorizeRoles(["user", "admin"]),
  authorizeProjectPermission("canEditProject"),
  validate(projectMembersRemoveSchema),
  removeMembers
);
router.get("/:slug/members", authenticate, authorizeRoles(["user", "admin"]), authorizeProjectPermission(), getMembers);

export default router;

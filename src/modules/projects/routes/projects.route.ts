import { authenticate } from "@/middleware/auth.middleware";
import { Router } from "express";
import {
  createProject,
  updateProject,
  addMembers,
  setMembers,
  removeMembers,
  getMembers,
  deleteProject
} from "../controllers/projects.controller";
import { projectSchema, projectMembersSchema, projectMembersRemoveSchema } from "../validators/project.validator";
import { validate } from "@/middleware/validate-middleware";
import { authorizeRoles } from "@/middleware/authorize-role.middleware";
import { authorizeProjectPermission } from "@/middleware/authorize-project-permission.middleware";
import { restrictFields } from "@/middleware/restrict-fields.middleware";

const router = Router();

router.post("/", authenticate, authorizeRoles(["user", "admin"]), validate(projectSchema), createProject);

router.patch(
  "/:slug",
  authenticate,
  authorizeRoles(["user", "admin"]),
  authorizeProjectPermission("canEditProject"),
  restrictFields(["credentials"]),
  validate(projectSchema.partial()),
  updateProject
);

router.delete(
  "/:slug",
  authenticate,
  authorizeRoles(["user", "admin"]),
  authorizeProjectPermission("CanDeleteProject"),
  deleteProject
);

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

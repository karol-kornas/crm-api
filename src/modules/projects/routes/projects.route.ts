import { authenticate } from "@/middleware/auth.middleware";
import { Router } from "express";
import { createProject, updateProject, deleteProject } from "../controllers/projects.controller";
import { projectSchema, projectUpdateSchema } from "../validators/project.validator";
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
  validate(projectUpdateSchema),
  updateProject
);

router.delete(
  "/:slug",
  authenticate,
  authorizeRoles(["user", "admin"]),
  authorizeProjectPermission("canDeleteProject"),
  deleteProject
);

export default router;

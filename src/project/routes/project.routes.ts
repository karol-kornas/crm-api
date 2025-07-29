import { authenticate } from "@/middleware/auth.middleware";
import { Router } from "express";
import { createProjectController, updateProjectController } from "../controllers/project.controllers";
import { projectSchema } from "../validators/project.validator";
import { validate } from "@/middleware/validate";
import { authorizeRoles } from "@/middleware/authorizeRole.middleware";
import { authorizeProjectPermission } from "@/middleware/authorizeProjectPermission.middleware";
import { restrictFields } from "@/middleware/restrictFields.middleware";

const router = Router();

router.post(
  "/create",
  authenticate,
  authorizeRoles(["user", "admin"]),
  validate(projectSchema),
  createProjectController
);

router.patch(
  "/update/:slug",
  authenticate,
  authorizeRoles(["user", "admin"]),
  authorizeProjectPermission("canEditProject"),
  restrictFields(["credentials"]),
  validate(projectSchema.partial()),
  updateProjectController
);

export default router;

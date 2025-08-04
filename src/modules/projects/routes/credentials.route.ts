import { authenticate } from "@/middleware/auth.middleware";
import { Router } from "express";
import { validate } from "@/middleware/validate-middleware";
import { authorizeRoles } from "@/middleware/authorize-role.middleware";
import { authorizeProjectPermission } from "@/middleware/authorize-project-permission.middleware";
import { addCredential, removeCredential, updateCredential } from "../controllers/credentials.controller";
import { credentialProjectSchema, credentialProjectUpdateSchema } from "../validators/credential.validator";

const router = Router();

router.post(
  "/:slug/credentials",
  authenticate,
  authorizeRoles(["user", "admin"]),
  authorizeProjectPermission("canEditCredentials"),
  validate(credentialProjectSchema),
  addCredential
);

router.delete(
  "/:slug/credentials/:id",
  authenticate,
  authorizeRoles(["user", "admin"]),
  authorizeProjectPermission("canEditCredentials"),
  removeCredential
);

router.patch(
  "/:slug/credentials/:id",
  authenticate,
  authorizeRoles(["user", "admin"]),
  authorizeProjectPermission("canEditCredentials"),
  validate(credentialProjectUpdateSchema),
  updateCredential
);

export default router;

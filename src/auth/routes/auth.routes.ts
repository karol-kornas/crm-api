import { Router } from "express";
import { validate } from "@/middleware/validate";
import {
  loginSchema,
  registerSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
} from "@/auth/validators/auth.validator";
import * as authController from "@/auth/controllers/auth.controller";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.get("/verify-email", authController.verifyEmail);
router.get("/resend-verify-email", authController.resendVerifyEmail);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);
router.post("/request-password-reset", validate(requestPasswordResetSchema), authController.requestPasswordReset);
router.post("/reset-password", validate(resetPasswordSchema), authController.resetPassword);

export default router;

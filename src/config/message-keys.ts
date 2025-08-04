export const messageKeys = {
  INTERNAL_ERROR: "internal_error",
  UNAUTHORIZED: "unauthorized",
  INSUFFICIENT_ROLE: "insufficient_role",
  VALIDATE: {
    FAILED: "validate.failed",
  },
  TOKEN: {
    MISSING: "token.missing",
    INVALID: "token.invalid",
    EXPIRES_MISSING: "token.expires_missing",
    EXPIRED: "token.expired",
  },
  REFRESH_TOKEN: {
    SUCCESS: "refresh_token.success",
    FAILED: "refresh_token.failed",
  },
  USER_NOT_FOUND: "user_not_found",
  EMAIL_MISSING: "email_missing",
  USER_ALREADY_VERIFIED: "user_already_verified",
  USER_NOT_VERIFIED: "user_not_verified",
  INVALID_CREDENTIALS: "invalid_credentials",
  USER_LOCKED: "user_locked",
  VERIFY_EMAIL: {
    SUCCESS: "verify_email.success",
    FAILED: "verify_email.failed",
  },
  RESEND_VERIFY_EMAIL: {
    SUCCESS: "resend_verify_email.success",
    FAILED: "resend_verify_email.failed",
  },
  REQUEST_PASSWORD_RESET: {
    SUCCESS: "request_password_reset.success",
    FAILED: "request_password_reset.failed",
    TOO_SOON: "request_password_reset.too_soon",
  },
  RESET_PASSWORD: {
    SUCCESS: "reset_password.success",
    FAILED: "reset_password.failed",
  },
  AUTH: {
    REGISTER: {
      SUCCESS: "auth.register.success",
      FAILED: "auth.register.failed",
      EMAIL_ALREADY_EXISTS: "auth.register.email_already_exists",
    },
    LOGIN: {
      SUCCESS: "auth.login.success",
      FAILED: "auth.login.failed",
    },
    LOGOUT: {
      SUCCESS: "auth.logout.success",
      FAILED: "auth.logout.failed",
    },
  },
  PROJECT: {
    NOT_FOUND: "project.not_found",
    SLUG_REQUIRED: "project.slug_required",
    CREATE: {
      SUCCESS: "project.create.success",
      FAILED: "project.create.failed",
      NAME_ALREADY_EXISTS: "project.name_already_exists",
      NAME_REQUIRED: "project.name_required",
    },
    DELETE: {
      SUCCESS: "project.delete.success",
      FAILED: "project.delete.failed",
    },
    UPDATE: {
      SUCCESS: "project.update.success",
      FAILED: "project.update.failed",
    },
    PERMISSION: {
      INVALID_REQUEST: "project.permission.invalid_request",
      NOT_A_MEMBER: "project.permission.not_a_member",
      FORBIDDEN: "project.permission.forbidden",
      FORBIDDEN_MODIFY_FIELDS: "forbidden_modify_fields",
    },
  },
  PROJECT_MEMBERS: {
    ADD: {
      SUCCESS: "project_members.add.success",
      FAILED: "project_members.add.failed",
    },
    SET: {
      SUCCESS: "project_members.set.success",
      FAILED: "project_members.set.failed",
    },
    REMOVE: {
      SUCCESS: "project_members.remove.success",
      FAILED: "project_members.remove.failed",
    },
    GET: {
      SUCCESS: "project_members.get.success",
      FAILED: "project_members.get.failed",
    },
  },
  PROJECT_CREDENTIALS: {
    ADD: {
      SUCCESS: "project_credentials.add.success",
      FAILED: "project_credentials.add.failed",
    },
    REMOVE: {
      SUCCESS: "project_credentials.remove.success",
      FAILED: "project_credentials.remove.failed",
    },
    UPDATE: {
      SUCCESS: "project_credentials.update.success",
      FAILED: "project_credentials.update.failed",
    },
    NOT_FOUND: "project_credentials.not_found",
  },
} as const;

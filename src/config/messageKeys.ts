export const messageKeys = {
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
} as const;

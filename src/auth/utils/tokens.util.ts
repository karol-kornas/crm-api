import crypto from "crypto";
import { REFRESH_TOKEN_EXPIRATION_MS, VERIFICATION_TOKEN_EXPIRATION_MS } from "@/config";

export const generateVerificationToken = () => {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRATION_MS); // 1h

  return { token, expires };
};

export const generateRefreshToken = () => {
  const token = crypto.randomBytes(40).toString("hex");
  const expires = new Date(Date.now() + REFRESH_TOKEN_EXPIRATION_MS); // 7d
  return { token, expires };
};

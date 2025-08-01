import { User } from "@/models/user/user.model";
import { sendResetPasswordEmail, sendVerificationEmail } from "@/mail/mail.service";
import {
  generateRefreshToken,
  generateResetPasswordToken,
  generateVerificationToken,
} from "@/modules/auth/utils/tokens.util";
import { IUser } from "@/types/user";
import { generateJwt } from "@/modules/auth/utils/jwt.util";
import createError from "http-errors";
import { messageKeys } from "@/config/message-keys";
import { TokenValidator } from "@/utils/token-validator.util";
import { REQUEST_PASSWORD_RESET_LOCK_MINUTES } from "@/config";

interface RegisterInput {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export const register = async (input: RegisterInput): Promise<IUser> => {
  const { first_name, last_name, email, password } = input;

  const existingUser = await User.findByEmail(email);

  if (existingUser) {
    throw createError(409, messageKeys.AUTH.REGISTER.EMAIL_ALREADY_EXISTS);
  }

  const { token, expires } = generateVerificationToken();

  const user = new User({
    first_name,
    last_name,
    email,
    password,
    email_verification_token: token,
    email_verification_token_expires: expires,
  });

  await user.save();

  await sendVerificationEmail(user);

  return user;
};

export const verifyEmail = async (token: string): Promise<IUser> => {
  const user = await TokenValidator.validate(token, "email_verification_token", "email_verification_token_expires");

  user.is_verified = true;
  user.email_verification_token = undefined;
  user.email_verification_token_expires = undefined;

  await user.save();

  return user;
};

export const resendVerifyEmail = async (email: string): Promise<IUser> => {
  if (!email) {
    throw createError(400, messageKeys.EMAIL_MISSING);
  }

  const user = await User.findByEmail(email);

  if (!user) {
    throw createError(401, messageKeys.USER_NOT_FOUND);
  }

  if (user.is_verified) {
    throw createError(401, messageKeys.USER_ALREADY_VERIFIED);
  }

  const { token, expires } = generateVerificationToken();

  user.email_verification_token = token;
  user.email_verification_token_expires = expires;

  await user.save();

  await sendVerificationEmail(user);

  return user;
};

interface LoginInput {
  email: string;
  password: string;
}

interface TokenAndUser {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

export const login = async (input: LoginInput): Promise<TokenAndUser> => {
  const { email, password } = input;
  const user = await User.findByEmail(email);

  if (!user) {
    throw createError(401, messageKeys.INVALID_CREDENTIALS);
  }

  if (user.isAccountLocked()) {
    throw createError(403, messageKeys.USER_LOCKED);
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    await user.incrementLoginAttempts();
    throw createError(401, messageKeys.INVALID_CREDENTIALS);
  }

  if (!user.is_verified) {
    throw createError(403, messageKeys.USER_NOT_VERIFIED);
  }

  user.last_login_at = new Date();
  await user.resetLoginAttempts();

  const accessToken = generateJwt(user);
  const { token: refreshToken, expires } = generateRefreshToken();

  user.refresh_tokens.push({ refresh_token: refreshToken, expires_at: expires });

  await user.save();

  return {
    accessToken,
    refreshToken,
    user,
  };
};

export const refreshToken = async (token: string): Promise<TokenAndUser> => {
  if (!token) {
    throw createError(401, messageKeys.TOKEN.MISSING);
  }

  const user = await User.findOne({
    "refresh_tokens.refresh_token": token,
  });

  if (!user) {
    throw createError(401, messageKeys.TOKEN.INVALID);
  }

  if (!user.is_verified) {
    throw createError(403, messageKeys.USER_NOT_VERIFIED);
  }

  if (user.isAccountLocked()) {
    throw createError(403, messageKeys.USER_LOCKED);
  }

  const storedToken = user.refresh_tokens.find((rt) => rt.refresh_token === token);

  if (!storedToken || storedToken.expires_at < new Date()) {
    throw createError(403, messageKeys.TOKEN.EXPIRED);
  }

  user.refresh_tokens = user.refresh_tokens.filter((rt) => rt.refresh_token !== token);

  const accessToken = generateJwt(user);
  const { token: newRefreshToken, expires } = generateRefreshToken();

  user.refresh_tokens.push({ refresh_token: newRefreshToken, expires_at: expires });

  user.refresh_tokens = user.refresh_tokens.sort((a, b) => b.expires_at.getTime() - a.expires_at.getTime()).slice(0, 5);

  await user.save();

  return {
    accessToken: accessToken,
    refreshToken: newRefreshToken,
    user,
  };
};

export const logout = async (refreshToken: string): Promise<void> => {
  if (!refreshToken) return;

  const user = await User.findOne({ "refresh_tokens.refresh_token": refreshToken });
  if (!user) return;

  user.refresh_tokens = user.refresh_tokens.filter((rt) => rt.refresh_token !== refreshToken);

  await user.save();
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  if (!email) {
    throw createError(400, messageKeys.EMAIL_MISSING);
  }

  const user = await User.findByEmail(email);

  if (!user) {
    throw createError(404, messageKeys.USER_NOT_FOUND);
  }

  const now = new Date();

  if (
    user.last_password_reset_requested_at &&
    now.getTime() - user.last_password_reset_requested_at.getTime() < REQUEST_PASSWORD_RESET_LOCK_MINUTES * 60 * 1000
  ) {
    throw createError(429, messageKeys.REQUEST_PASSWORD_RESET.TOO_SOON);
  }

  const { token, expires } = generateResetPasswordToken();

  user.password_reset_token = token;
  user.password_reset_token_expires = expires;
  user.last_password_reset_requested_at = now;

  await user.save();

  await sendResetPasswordEmail(user);
};

export const resetPassword = async (token: string, password: string): Promise<void> => {
  const user = await TokenValidator.validate(token, "password_reset_token", "password_reset_token_expires");

  user.password = password;
  user.password_reset_token = undefined;
  user.password_reset_token_expires = undefined;

  await user.save();
};

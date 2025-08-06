import { User } from "@/models/user/user.model";
import { sendResetPasswordEmail, sendVerificationEmail } from "@/mail/mail.service";
import {
  generateRefreshToken,
  generateResetPasswordToken,
  generateVerificationToken,
} from "@/modules/auth/utils/tokens.util";
import { generateJwt } from "@/modules/auth/utils/jwt.util";
import createError from "http-errors";
import { messageKeys } from "@/config/message-keys";
import { TokenValidator } from "@/utils/token-validator.util";
import { REQUEST_PASSWORD_RESET_LOCK_MINUTES } from "@/config";
import { IUser } from "@/types/auth/model.type";
import {
  LoginParams,
  RefreshTokenParams,
  RegisterParams,
  RequestPasswordResetParams,
  ResendVerifyEmailParams,
  ResetPasswordParams,
  VerifyEmailParams,
} from "@/types/auth/params.type";
import { TokensAndUser } from "@/types/auth/shared.type";

export const register = async ({ userData }: RegisterParams): Promise<IUser> => {
  const { firstName, lastName, email, password } = userData;

  const existingUser = await User.findByEmail(email);

  if (existingUser) {
    throw createError(409, messageKeys.AUTH.REGISTER.EMAIL_ALREADY_EXISTS);
  }

  const { token, expires } = generateVerificationToken();

  const user = new User({
    firstName,
    lastName,
    email,
    password,
    emailVerificationToken: token,
    emailVerificationTokenExpires: expires,
  });

  await user.save();

  await sendVerificationEmail(user);

  return user;
};

export const verifyEmail = async ({ token }: VerifyEmailParams): Promise<IUser> => {
  const user = await TokenValidator.validate(
    token,
    "emailVerificationToken",
    "emailVerificationTokenExpires"
  );

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpires = undefined;

  await user.save();

  return user;
};

export const resendVerifyEmail = async ({ email }: ResendVerifyEmailParams): Promise<IUser> => {
  if (!email) {
    throw createError(400, messageKeys.EMAIL_MISSING);
  }

  const user = await User.findByEmail(email);

  if (!user) {
    throw createError(401, messageKeys.USER_NOT_FOUND);
  }

  if (user.isVerified) {
    throw createError(401, messageKeys.USER_ALREADY_VERIFIED);
  }

  const { token, expires } = generateVerificationToken();

  user.emailVerificationToken = token;
  user.emailVerificationTokenExpires = expires;

  await user.save();

  await sendVerificationEmail(user);

  return user;
};

export const login = async ({ userCredential }: LoginParams): Promise<TokensAndUser> => {
  const { email, password } = userCredential;
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

  if (!user.isVerified) {
    throw createError(403, messageKeys.USER_NOT_VERIFIED);
  }

  user.lastLoginAt = new Date();
  await user.resetLoginAttempts();

  const accessToken = generateJwt(user);
  const { token: refreshToken, expires } = generateRefreshToken();

  user.refreshTokens.push({ refreshToken, expiresAt: expires });

  await user.save();

  return {
    accessToken,
    refreshToken,
    user,
  };
};

export const refreshToken = async ({ token }: RefreshTokenParams): Promise<TokensAndUser> => {
  if (!token) {
    throw createError(401, messageKeys.TOKEN.MISSING);
  }

  const user = await User.findOne({
    "refreshTokens.refreshToken": token,
  });

  if (!user) {
    throw createError(401, messageKeys.TOKEN.INVALID);
  }

  if (!user.isVerified) {
    throw createError(403, messageKeys.USER_NOT_VERIFIED);
  }

  if (user.isAccountLocked()) {
    throw createError(403, messageKeys.USER_LOCKED);
  }

  const storedToken = user.refreshTokens.find((rt) => rt.refreshToken === token);

  if (!storedToken || storedToken.expiresAt < new Date()) {
    throw createError(403, messageKeys.TOKEN.EXPIRED);
  }

  user.refreshTokens = user.refreshTokens.filter((rt) => rt.refreshToken !== token);

  const accessToken = generateJwt(user);
  const { token: newRefreshToken, expires } = generateRefreshToken();

  user.refreshTokens.push({ refreshToken: newRefreshToken, expiresAt: expires });

  user.refreshTokens = user.refreshTokens
    .sort((a, b) => b.expiresAt.getTime() - a.expiresAt.getTime())
    .slice(0, 5);

  await user.save();

  return {
    accessToken: accessToken,
    refreshToken: newRefreshToken,
    user,
  };
};

export const logout = async (refreshToken: string): Promise<void> => {
  if (!refreshToken) return;

  const user = await User.findOne({ "refreshTokens.refreshToken": refreshToken });
  if (!user) return;

  user.refreshTokens = user.refreshTokens.filter((rt) => rt.refreshToken !== refreshToken);

  await user.save();
};

export const requestPasswordReset = async ({ userData }: RequestPasswordResetParams): Promise<void> => {
  const { email } = userData;

  if (!email) {
    throw createError(400, messageKeys.EMAIL_MISSING);
  }

  const user = await User.findByEmail(email);

  if (!user) {
    throw createError(404, messageKeys.USER_NOT_FOUND);
  }

  const now = new Date();

  if (
    user.lastPasswordResetRequestedAt &&
    now.getTime() - user.lastPasswordResetRequestedAt.getTime() <
      REQUEST_PASSWORD_RESET_LOCK_MINUTES * 60 * 1000
  ) {
    throw createError(429, messageKeys.REQUEST_PASSWORD_RESET.TOO_SOON);
  }

  const { token, expires } = generateResetPasswordToken();

  user.passwordResetToken = token;
  user.passwordResetTokenExpires = expires;
  user.lastPasswordResetRequestedAt = now;

  await user.save();

  await sendResetPasswordEmail(user);
};

export const resetPassword = async ({ userData }: ResetPasswordParams): Promise<void> => {
  const { token, password } = userData;
  const user = await TokenValidator.validate(token, "passwordResetToken", "passwordResetTokenExpires");

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;

  await user.save();
};

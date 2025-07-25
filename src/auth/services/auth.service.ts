import { User } from "@/models/user/user.model";
import { sendResetPasswordEmail, sendVerificationEmail } from "@/mail/mail.service";
import { generateRefreshToken, generateResetPasswordToken, generateVerificationToken } from "@/auth/utils/tokens.util";
import { IUser } from "@/types/user";
import { generateJwt } from "@/auth/utils/jwt.util";
import createError from "http-errors";
import { messageKeys } from "@/config/messageKeys";
import { TokenValidator } from "@/utils/tokenValidator.util";
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
    verification_token: token,
    verification_token_expires: expires,
  });

  await user.save();

  await sendVerificationEmail(user);

  return user;
};

export const verifyEmail = async (token: string): Promise<IUser> => {
  const user = await TokenValidator.validate(token, "verification_token", "verification_token_expires");

  user.is_verified = true;
  user.verification_token = undefined;
  user.verification_token_expires = undefined;

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

  user.verification_token = token;
  user.verification_token_expires = expires;

  await user.save();

  await sendVerificationEmail(user);

  return user;
};

interface LoginInput {
  email: string;
  password: string;
}

interface TokenAndUser {
  token: string;
  refresh_token: string;
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

  user.refresh_tokens.push({ token: refreshToken, expires_at: expires });

  await user.save();

  return { token: accessToken, refresh_token: refreshToken, user };
};

export const refreshToken = async (token: string): Promise<TokenAndUser> => {
  if (!token) {
    throw createError(401, messageKeys.TOKEN.MISSING);
  }

  const user = await User.findOne({
    "refresh_tokens.token": token,
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

  const storedToken = user.refresh_tokens.find((rt) => rt.token === token);

  if (!storedToken || storedToken.expires_at < new Date()) {
    throw createError(403, messageKeys.TOKEN.EXPIRED);
  }

  user.refresh_tokens = user.refresh_tokens.filter((rt) => rt.token !== token);

  const accessToken = generateJwt(user);
  const { token: newRefreshToken, expires } = generateRefreshToken();

  user.refresh_tokens.push({ token: newRefreshToken, expires_at: expires });

  user.refresh_tokens = user.refresh_tokens.sort((a, b) => b.expires_at.getTime() - a.expires_at.getTime()).slice(0, 5);

  await user.save();

  return {
    token: accessToken,
    refresh_token: newRefreshToken,
    user,
  };
};

export const logout = async (refreshToken: string): Promise<void> => {
  if (!refreshToken) return;

  const user = await User.findOne({ "refresh_tokens.token": refreshToken });
  if (!user) return;

  user.refresh_tokens = user.refresh_tokens.filter((rt) => rt.token !== refreshToken);

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

  user.reset_password_token = token;
  user.reset_password_token_expires = expires;
  user.last_password_reset_requested_at = now;

  await user.save();

  await sendResetPasswordEmail(user);
};

export const resetPassword = async (token: string, password: string): Promise<void> => {
  const user = await TokenValidator.validate(token, "reset_password_token", "reset_password_token_expires");

  user.password = password;
  user.reset_password_token = undefined;
  user.reset_password_token_expires = undefined;

  await user.save();
};

import { User } from "@/models/user/user.model";
import { sendVerificationEmail } from "@/mail/mail.service";
import { generateRefreshToken, generateVerificationToken } from "@/auth/utils/tokens.util";
import { IUser } from "@/types/user";
import { generateJwt } from "@/auth/utils/jwt.util";
import createError from "http-errors";

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
    throw new Error("User with this email already exists");
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

export const verifyEmail = async (token: string) => {
  if (!token) {
    throw new Error("Token is missing");
  }

  const user = await User.findOne({ verification_token: token });

  if (!user) {
    throw new Error("Token is invalid");
  }

  if (!user.verification_token_expires) {
    throw new Error("Token expires is missing");
  }

  if (user.verification_token_expires < new Date()) {
    throw new Error("Token expired");
  }

  user.is_verified = true;
  user.verification_token = undefined;
  user.verification_token_expires = undefined;

  await user.save();

  return user;
};

export const resendVerifyEmail = async (email: string) => {
  if (!email) {
    throw new Error("Email is missing");
  }

  const user = await User.findByEmail(email);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.is_verified) {
    throw new Error("User is already verified");
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
    throw createError(401, "auth.login.invalid_credentials");
  }

  if (user.isAccountLocked()) {
    throw createError(403, "auth.login.account_locked");
  }

  if (user.locked_until) {
    await user.resetLoginAttempts();
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    await user.incrementLoginAttempts();
    throw createError(401, "auth.login.invalid_credentials");
  }

  if (!user.is_verified) {
    throw createError(403, "auth.login.email_not_verified");
  }

  user.last_login_at = new Date();
  await user.resetLoginAttempts();

  const accessToken = generateJwt(user);
  const { token: refreshToken, expires } = generateRefreshToken();

  user.refresh_tokens.push({ token: refreshToken, expires_at: expires });

  await user.save();

  return { token: accessToken, refresh_token: refreshToken, user };
};

export const refreshToken = async (token: string) => {
  if (!token) {
    throw createError(401, "auth.refresh_token.missing_token");
  }

  const user = await User.findOne({
    "refresh_tokens.token": token,
  });

  if (!user) {
    throw createError(403, "auth.refresh_token.invalid_token");
  }

  const storedToken = user.refresh_tokens.find((rt) => rt.token === token);

  if (!storedToken || storedToken.expires_at < new Date()) {
    throw createError(403, "auth.refresh_token.token_expired");
  }

  user.refresh_tokens = user.refresh_tokens.filter((rt) => rt.token !== token);

  const accessToken = generateJwt(user);
  const { token: newRefreshToken, expires } = generateRefreshToken();

  user.refresh_tokens.push({ token: newRefreshToken, expires_at: expires });

  await user.save();

  return {
    token: accessToken,
    refresh_token: newRefreshToken,
    user,
  };
};

export const logout = async (refreshToken: string) => {
  if (!refreshToken) return;

  const user = await User.findOne({ "refresh_tokens.token": refreshToken });
  if (!user) return;

  user.refresh_tokens = user.refresh_tokens.filter((rt) => rt.token !== refreshToken);

  await user.save();
};

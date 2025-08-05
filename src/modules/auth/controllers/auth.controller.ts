import { NextFunction, Request, RequestHandler, Response } from "express";
import * as authService from "@/modules/auth/services/auth.service";
import createError from "http-errors";
import { REFRESH_TOKEN_EXPIRATION_MS } from "@/config";
import { messageKeys } from "@/config/message-keys";
import { LoginResponse, UserResponse } from "@/types/auth/response.type";
import { LoginBody, RegisterBody, RequestPasswordResetBody, ResetPasswordBody } from "@/types/auth/body.type";
import { EmptyDataResponse } from "@/types/shared.type";

export const register: RequestHandler<{}, UserResponse, RegisterBody> = async (req, res, next) => {
  try {
    const { userData } = req.body;
    const user = await authService.register({ userData });
    return res.status(201).json({
      success: true,
      message: messageKeys.AUTH.REGISTER.SUCCESS,
      data: {
        user,
      },
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.AUTH.REGISTER.FAILED));
    }
    next(err);
  }
};

export const verifyEmail: RequestHandler<{}, UserResponse, {}, { token: string }> = async (
  req,
  res,
  next
) => {
  const { token } = req.query;
  try {
    const user = await authService.verifyEmail({ token });

    return res.status(200).json({
      success: true,
      message: messageKeys.VERIFY_EMAIL.SUCCESS,
      data: {
        user,
      },
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.VERIFY_EMAIL.FAILED));
    }
    next(err);
  }
};

export const resendVerifyEmail: RequestHandler<{}, UserResponse, {}, { email: string }> = async (
  req,
  res,
  next
) => {
  const { email } = req.query;

  try {
    const user = await authService.resendVerifyEmail({ email });
    return res.status(200).json({
      success: true,
      message: messageKeys.RESEND_VERIFY_EMAIL.SUCCESS,
      data: {
        user,
      },
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.RESEND_VERIFY_EMAIL.FAILED));
    }
    next(err);
  }
};

export const login: RequestHandler<{}, LoginResponse, LoginBody> = async (req, res, next) => {
  try {
    const { userCredential } = req.body;
    const { accessToken, refreshToken, user } = await authService.login({ userCredential });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: REFRESH_TOKEN_EXPIRATION_MS,
    });
    res.status(200).json({
      success: true,
      message: messageKeys.AUTH.LOGIN.SUCCESS,
      data: { accessToken, user },
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.AUTH.LOGIN.FAILED));
    }
    next(err);
  }
};

export const refreshToken: RequestHandler<{}, LoginResponse> = async (req, res, next) => {
  const { refresh_token } = req.cookies as { refresh_token: string };

  try {
    const { accessToken, refreshToken, user } = await authService.refreshToken({ token: refresh_token });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: REFRESH_TOKEN_EXPIRATION_MS,
    });
    return res.status(200).json({
      success: true,
      message: messageKeys.REFRESH_TOKEN.SUCCESS,
      data: {
        accessToken,
        user,
      },
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.REFRESH_TOKEN.FAILED));
    }
    next(err);
  }
};

export const logout: RequestHandler<{}, EmptyDataResponse> = async (req, res, next) => {
  const token = req.cookies.refresh_token as string;
  try {
    await authService.logout(token);

    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: messageKeys.AUTH.LOGOUT.SUCCESS,
      data: {},
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.AUTH.LOGOUT.FAILED));
    }
    next(err);
  }
};

export const requestPasswordReset: RequestHandler<{}, EmptyDataResponse, RequestPasswordResetBody> = async (
  req,
  res,
  next
) => {
  const { userData } = req.body;
  try {
    await authService.requestPasswordReset({ userData });
    return res.status(200).json({
      success: true,
      message: messageKeys.REQUEST_PASSWORD_RESET.SUCCESS,
      data: {},
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.REQUEST_PASSWORD_RESET.FAILED));
    }
    next(err);
  }
};

export const resetPassword: RequestHandler<{}, EmptyDataResponse, ResetPasswordBody> = async (
  req,
  res,
  next
) => {
  const { userData } = req.body;

  try {
    await authService.resetPassword({ userData });

    return res.status(200).json({
      success: true,
      message: messageKeys.RESET_PASSWORD.SUCCESS,
      data: {},
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.RESET_PASSWORD.FAILED));
    }
    next(err);
  }
};

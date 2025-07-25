import { NextFunction, Request, Response } from "express";
import * as authService from "@/auth/services/auth.service";
import createError from "http-errors";
import { REFRESH_TOKEN_EXPIRATION_MS } from "@/config";
import { messageKeys } from "@/config/messageKeys";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.register(req.body);
    return res.status(201).json({
      success: true,
      message: messageKeys.AUTH.REGISTER.SUCCESS,
      data: user,
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.AUTH.REGISTER.FAILED));
    }
    next(err);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.query.token as string;
  try {
    const user = await authService.verifyEmail(token);

    return res.status(200).json({
      success: true,
      messageKey: messageKeys.VERIFY_EMAIL.SUCCESS,
      data: user,
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.VERIFY_EMAIL.FAILED));
    }
    next(err);
  }
};

export const resendVerifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  const email = req.query.email as string;

  try {
    const user = await authService.resendVerifyEmail(email);
    return res.status(200).json({
      success: true,
      messageKey: messageKeys.RESEND_VERIFY_EMAIL.SUCCESS,
      data: user,
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.RESEND_VERIFY_EMAIL.FAILED));
    }
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.login(req.body);
    res.cookie("refresh_token", result.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: REFRESH_TOKEN_EXPIRATION_MS,
    });
    res.status(200).json({
      success: true,
      messageKey: messageKeys.AUTH.LOGIN.SUCCESS,
      data: { token: result.token, user: result.user },
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.AUTH.LOGIN.FAILED));
    }
    next(err);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.refresh_token;
  try {
    const result = await authService.refreshToken(token);
    res.cookie("refresh_token", result.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: REFRESH_TOKEN_EXPIRATION_MS,
    });
    return res.status(200).json({
      success: true,
      message: messageKeys.REFRESH_TOKEN.SUCCESS,
      data: { token: result.token, user: result.user },
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.REFRESH_TOKEN.FAILED));
    }
    next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.refresh_token;
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
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.AUTH.LOGOUT.FAILED));
    }
    next(err);
  }
};

export const requestPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  try {
    await authService.requestPasswordReset(email);
    return res.status(200).json({
      success: true,
      message: messageKeys.REQUEST_PASSWORD_RESET.SUCCESS,
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.REQUEST_PASSWORD_RESET.FAILED));
    }
    next(err);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { token, password } = req.body;

  try {
    await authService.resetPassword(token, password);

    return res.status(200).json({
      success: true,
      message: messageKeys.RESET_PASSWORD.SUCCESS,
    });
  } catch (err: any) {
    if (!err.status) {
      return next(createError(500, messageKeys.RESET_PASSWORD.FAILED));
    }
    next(err);
  }
};

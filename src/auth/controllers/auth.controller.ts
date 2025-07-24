import { NextFunction, Request, Response } from "express";
import * as authService from "@/auth/services/auth.service";
import { isHttpError } from "http-errors";
import { REFRESH_TOKEN_EXPIRATION_MS } from "@/config";

export const register = async (req: Request, res: Response) => {
  try {
    const user = await authService.register(req.body);

    return res.status(201).json({
      success: true,
      messageKey: "auth.register.success",
      data: user,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      messageKey: "auth.register.failed",
      message: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const token = req.query.token as string;
  try {
    const user = await authService.verifyEmail(token);

    return res.status(200).json({
      success: true,
      messageKey: "auth.verify.success",
      data: user,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      messageKey: "auth.verify_email.invalid_or_expired",
      message: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

export const resendVerifyEmail = async (req: Request, res: Response) => {
  const email = req.query.email as string;

  try {
    const user = await authService.resendVerifyEmail(email);
    return res.status(200).json({
      success: true,
      messageKey: "auth.resend_verify_email.success",
      data: user,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      messageKey: "auth.resend_verify_email.failed",
      message: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.login(req.body);
    res.cookie("refresh_token", result.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: REFRESH_TOKEN_EXPIRATION_MS, // 7 dni
    });
    res.status(200).json({
      success: true,
      messageKey: "auth.login.success",
      data: { token: result.token, user: result.user },
    });
  } catch (err: any) {
    if (isHttpError(err)) {
      return res.status(err.status).json({ success: false, messageKey: err.message });
    }
    return res.status(500).json({
      success: false,
      messageKey: "auth.login.invalid_credentials",
      message: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.refresh_token;
    const result = await authService.refreshToken(token);
    res.cookie("refresh_token", result.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: REFRESH_TOKEN_EXPIRATION_MS,
    });
    return res.status(200).json({
      success: true,
      messageKey: "auth.refresh_token.success",
      data: { token: result.token, user: result.user },
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.refresh_token;
    await authService.logout(token);

    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      messageKey: "auth.logout.success",
    });
  } catch (err) {
    next(err);
  }
};

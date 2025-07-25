import { NextFunction, Request, Response } from "express";

interface ErrorWithStatus extends Error {
  status?: number;
}

export function errorHandler(err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) {
  const statusCode = err.status || 500;
  const message = err.message || "internal.server_error";

  const response: any = {
    success: false,
    message,
  };

  if (process.env.NODE_ENV === "development" && err.stack) {
    response.stack = err.stack;
    response.error = {
      name: err.name,
      message: err.message,
    };
  }

  res.status(statusCode).json(response);
}

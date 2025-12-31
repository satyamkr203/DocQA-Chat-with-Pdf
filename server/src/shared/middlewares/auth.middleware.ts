import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { ApiError } from "../errors/ApiError";

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  _: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new ApiError(401, "Authorization header missing");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new ApiError(401, "Token missing");
  }

  const payload = verifyToken(token);
  req.userId = payload.userId;

  next();
};

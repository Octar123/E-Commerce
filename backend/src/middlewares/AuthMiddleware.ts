import { NextFunction, Request, Response } from "express";
import { sessionStore } from "../utils/sessionStore";
import { UserRole } from "../entities/User";
import * as dotenv from "dotenv";
import { error } from "console";

dotenv.config();
export interface AuthRequest extends Request {
    user: {id: string, role: UserRole, name: string}
}

export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const sessionId = req.cookies.auth_token;

  if (!sessionId) {
    return res
      .status(401)
      .json({
        success: false,
        error: "Unauthorized: No session cookie found.",
      });
  }

  const sessionData = sessionStore.get(sessionId);
  
  if (!sessionData) {
    res.clearCookie("auth_token", { path: "/" });
    return res.status(401).json({success: false, error: "Unauthorized: Session invalid or expired"});
  }

  req.user = sessionData;

  next();
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if(!user || user.role !== UserRole.ADMIN){
        return res.status(403).json({success: false, error: "Forbidden: Admin access is required"});
    }

    next();
}

export const checkAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const sessionId = req.cookies.auth_token;

  if(!sessionId) {
    return next();
  }

  const sessionData = sessionStore.get(sessionId);
  
  if (!sessionData) {
    return next();
  }

  req.user = sessionData;

  next();
}

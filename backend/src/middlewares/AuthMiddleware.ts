import { NextFunction, Request, Response } from "express";
import { sessionStore } from "../utils/sessionStore";
import { UserRole } from "../entities/User";

interface AuthRequest extends Request {
    user: {id: string, role: UserRole}
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

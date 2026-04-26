import { Router } from "express";
import { authController, AuthController } from "../controllers/AuthController";
import { requireAuth } from "../middlewares/AuthMiddleware";

const AuthRoutes = Router();

AuthRoutes.post("/register", authController.register);
AuthRoutes.post("/login", authController.login);
AuthRoutes.get("/logout", authController.logout);
AuthRoutes.post("/forgot", requireAuth, authController.forgotPassword);
AuthRoutes.post("/reset", requireAuth, authController.resetPassword);

export default AuthRoutes;
import { Router } from "express";
import { authController, AuthController } from "../controllers/AuthController";

const AuthRoutes = Router();

AuthRoutes.post("/register", authController.register);
AuthRoutes.post("/login", authController.login);

export default AuthRoutes;
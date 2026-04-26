import { Router } from "express";
import { authController, AuthController } from "../controllers/AuthController";

const AuthRoutes = Router();

AuthRoutes.post("/register", authController.register);

export default AuthRoutes;
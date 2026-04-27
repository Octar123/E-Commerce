import { Router } from "express";
import { cartController } from "../controllers/CartController";
import { requireAuth } from "../middlewares/AuthMiddleware";

const cartRoutes = Router();

cartRoutes.post("/:id/add", requireAuth, cartController.addToCart);

export default cartRoutes;
import { Router } from "express";
import { cartController } from "../controllers/CartController";

const cartRoutes = Router();

cartRoutes.get("/", cartController.getCart);
cartRoutes.post("/:id/add", cartController.addToCart);
cartRoutes.post("/:itemId/update", cartController.updateQuantity);
cartRoutes.delete("/:itemId/delete", cartController.deleteCartItem);
cartRoutes.delete("/clear", cartController.deleteCart);
cartRoutes.get("/total", cartController.getCartTotal);

export default cartRoutes;
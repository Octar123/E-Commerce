import { Router } from "express";
import { orderController } from "../controllers/OrderController";

const OrderRoutes = Router();

OrderRoutes.post("/place", orderController.placeOrder);
OrderRoutes.get("/all", orderController.getAllOrders);
OrderRoutes.get("/:orderId", orderController.getOrderDetail);

export default OrderRoutes;
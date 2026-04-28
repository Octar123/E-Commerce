import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Cart } from "../entities/Cart";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { CartItem } from "../entities/CartItem";
import { cartController } from "./CartController";
import { UserRole } from "../entities/User";

class OrderController {
  private cartRepo = AppDataSource.getRepository(Cart);
  private orderRepo = AppDataSource.getRepository(Order);
  private orderItemRepo = AppDataSource.getRepository(OrderItem);

  placeOrder = async (req: Request, res: Response) => {
    const user = (req as any).user;

    const { paymentMethod } = req.body;

    const totals = await cartController.getTotal(user);

    const cart = await this.cartRepo.findOne({
      where: { user: { id: user.id } },
      relations: ["cartItems", "cartItems.product"],
    });

    if (!cart || cart.cartItems.length === 0) {
      return res.status(404).json({ success: false, error: "Cart Not Found" });
    }

    try {
      await AppDataSource.transaction(async (manager) => {
        const order = manager.create(Order, {
          user: { id: user.id },
          paymentMethod,
          totalAmount: totals.totalAmount
        });

        await manager.save(order);

        const orderItems = cart.cartItems.map((item) => {
          manager.create(OrderItem, {
            order,
            amountAtPurchase: item.product.price,
            product: item.product,
            quantity: item.quantity,
          });
        });

        await manager.save(orderItems);
      });

      return res
        .status(201)
        .json({ success: true, message: "Order Placed Successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: "Failed to place order" });
    }
  };
}

export const orderController = new OrderController();

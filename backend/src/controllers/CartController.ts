import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Cart } from "../entities/Cart";
import { CartItem } from "../entities/CartItem";
import { Product } from "../entities/Product";
import { User } from "../entities/User";

class CartController {
  private userRepo = AppDataSource.getRepository(User);
  private cartItemRepo = AppDataSource.getRepository(CartItem);
  private cartRepo = AppDataSource.getRepository(Cart);
  private productRepo = AppDataSource.getRepository(Product);

  addToCart = async (req: Request, res: Response) => {
    try{
      const id = Number(req.params.id);

      if (!id) {
        return res
          .status(404)
          .json({ success: false, error: "Produt Not Found" });
      }
      const { quantity } = req.body || 1;

      const user = (req as any).user;

      let cart = await this.cartRepo.findOne({
        where: { user: { id: user.id } },
        relations: ["cartItems", "cartItems.product"]
      });

      if (!cart) {
        cart = this.cartRepo.create({
          user: { id: user.id },
        });
        await this.cartRepo.save(cart);
      }

      cart = await this.cartRepo.findOne({
        where: { user: { id: user.id } },
        relations: ["cartItems", "cartItems.product"]
      });

      let cartItem = cart.cartItems.find((c) => c.product.id === id);

      if (cartItem) {
        cartItem.quantity += quantity;
      } else {
        cartItem = this.cartItemRepo.create({
          cart,
          product: { id },
          quantity
        });
      }

      await this.cartItemRepo.save(cartItem);

      res
        .status(200)
        .json({ success: true, message: "Product Added To Your Cart" });
    }catch(error){
        console.error(error);
        res.status(500).json({success: false, error: "Error while Adding Product to Cart"})
    }
  };
}

export const cartController = new CartController();
